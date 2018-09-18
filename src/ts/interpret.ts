import { ImportDeclaration, StringExpression, SyntaxTree, FunctionDeclaration, TokenLocation } from "./ast";
import { ErrorImportFail } from "./errorType/E0030-ImportFail";
import { ErrorDetail } from "./errorType/ErrorDetail";
import { fail, isFail, isOK, Maybe, ok } from "./maybeMonad";
import { getIntermediateRepresentation, initialIntermediateForm, IntermediateRepresentation } from "./getIntermediateRepresentation";
import { parseCodeToSyntaxTree } from "./parseCodeToSyntaxTree";
import { tpDeclaration, transpile } from "./transpile";
import { endsWith, startsWith } from "./util";
import { SymbolTable } from "./fillUpTypeInformation";
import { removeHiddenToken } from "./errorType/renderError";

const fs       = require("fs");
const path     = require("path");
const toposort = require("toposort");

interface SyntaxTreeCache {[filename: string]: SyntaxTree; }

type CodeExecuter = (code: string, ir?: IntermediateRepresentation) => any;

export type ErrorHandler = (e: Error) => void;

export type ErrorStackTrace = {
    name: "ErrorStackTrace";
    stack: ErrorTrace[];
}


export interface ErrorTrace extends TokenLocation {
    callingFile: string;
    lineContent: string;
    insideWhichFunction: string;
}

export function isErrorDetail(e: ErrorStackTrace | ErrorDetail): e is ErrorDetail {
    return e.name !== "ErrorStackTrace";
}

export function isErrorStackTrace(e: ErrorStackTrace | ErrorDetail): e is ErrorStackTrace {
    return e.name === "ErrorStackTrace";
}

export function interpret(
    source: SourceCode,
    execute: CodeExecuter,
    loadPreludeLibrary: boolean,
    generateSourceMap: boolean
): Maybe<string, ErrorDetail | ErrorStackTrace> {
    if (loadPreludeLibrary) {
        source.content = source.content + `\nimport "$pine/prelude/*"`;
    }
    const initialCache: SyntaxTreeCache = {};
    const parsedCode = parseCodeToSyntaxTree(source);
    if (isFail(parsedCode)) { return parsedCode; }
    const ast = parsedCode.value;

    // console.log(JSON.stringify(ast.declarations,null,2));

    initialCache[source.filename] = ast;
    const extractResult = extractImports(ast, initialCache);
    if (isFail(extractResult)) { return extractResult; }
    const [dependencies, updatedCache] = extractResult.value;

    const sortedDependencies = sortDependency(dependencies);
    const sortedSyntaxTrees = sortedDependencies.map((x) => updatedCache[x]).filter((x) => x !== undefined);
    const result = loadSource(sortedSyntaxTrees);
    if (isOK(result)) {
        const ir = result.value; // ir means intermediate representation
        const funcDeclarations = getFunctionDeclarations(ir);
        const transpiledCode = transpile(funcDeclarations, generateSourceMap);
        const output = execute(transpiledCode, ir);

        if(output === undefined) { // This will happen when the VM is waiting input
            return ok("");
        }

        if(!output.stack) { // if output is ok
            //TODO: This current implementation cannot handle error stack trace when the main function 
            // involve async functions such as readline
            return ok(output);
        } else {
            if(output.name === "EnsuranceFailed") {
                const rawErrorTrace = output.stack.split("\n") as string[];
                return fail(extractErrorStackTrace(rawErrorTrace, updatedCache, transpiledCode));
            } else {
                return fail(output);
            }
        }
    } else {
        return result;
    }
}

function extractErrorStackTrace(
    rawErrorTrace: string[], 
    updatedCache: SyntaxTreeCache,
    transpiledCode: string
    ): ErrorStackTrace {
    const errorTrace: ErrorTrace[] = [];

    // start from 2, because 0 to 1 is the error message
    for(let i = 2; i < rawErrorTrace.length; i++) {
        const trace = rawErrorTrace[i].trim().split(" ");
        const lineNumber = parseInt(trace[2].split(":")[1]);
        const x = JSON.parse(transpiledCode.split("\n")[lineNumber - 2].split("##")[1]);
        const lineContent = removeHiddenToken( 
            updatedCache[x.callingFile].source.content.split("\n")[x.first_line - 1]
        );
        errorTrace.push({
            ...x,
            lineContent: lineContent,
            insideWhichFunction: "." + trace[1].split("_")[1].split("$").join(" ")
        });
        if(trace[1] === "_main_") {
            break;
        }
    }
    const errorStackTrace: ErrorStackTrace = {
        name: "ErrorStackTrace",
        stack: errorTrace
    };
    return errorStackTrace;
}

function extractImports(ast: SyntaxTree, cache: SyntaxTreeCache)
: Maybe<[Dependencies, SyntaxTreeCache], ErrorDetail> {

    let dependencies: Dependencies = [
        [ast.source.filename, /*depends on */ Nothing()]
    ];

    const importedFiles = (ast.declarations
        .filter((x) => x.kind === "ImportDeclaration") as ImportDeclaration[])
        .map((x) => x.filename);

    for (let i = 0; i < importedFiles.length; i++) {
        let files: string [] = [];

        const repr = importedFiles[i].repr;
        if (startsWith(repr, '"$')) {
            if (startsWith(repr, '"$pine/')) {
                const pinelibPath = __dirname + "/../pinelib";
                importedFiles[i].repr = repr.replace("$pine", pinelibPath);
            } else {
                throw new Error(`Cannot handle ${repr} yet`);
            }
        }
        if (endsWith(importedFiles[i].repr, '*"')) {
            const dirname = importedFiles[i].repr.slice(1, -2);
            if (fs.existsSync(dirname)) {
                files = fs.readdirSync(dirname).filter((x: string) => /[.]pine$/.test(x));
                files = files.map((x) => fs.realpathSync(dirname + "/" + x));
                files = files.filter((x) => fs.lstatSync(x).isFile()); // remove directory names
            } else {
                throw new Error(`Cannot import the directory ${importedFiles[i].repr}`);
            }
        } else {
            // automaticallyl append file extension
            importedFiles[i].repr = importedFiles[i].repr.slice(0, -1) + '.pine"';

            const result = getFullFilename(ast, importedFiles[i]);
            if (isFail(result)) { return result; }

            files = [result.value];
        }
        for (let j = 0; j < files.length; j++) {
            const f = loadFile(files[j]);
            if (f !== null) {
                const parsedCode = parseCodeToSyntaxTree(f);
                if (!isOK(parsedCode)) { return parsedCode; }
                cache[f.filename] = parsedCode.value;
                const temp = dependencies.slice();
                const extractResult = extractImports(parsedCode.value, cache);
                if (isFail(extractResult)) { return extractResult; }
                [dependencies, cache] = extractResult.value;
                dependencies = dependencies.concat(temp);
            } else {
                throw new Error("why?");
            }
            dependencies.push([ast.source.filename, /*depends on*/ f.filename]);
        }
    }
    return ok([dependencies, cache] as [Dependencies, SyntaxTreeCache]);
}

function getFullFilename(ast: SyntaxTree, importedFilename: StringExpression)
: Maybe<string, ErrorDetail> {
    const filename = importedFilename.repr.slice(1, -1);
    let fullFilename: string = (() => {
        if (importedFilename.repr[1] === "/") { // if is absolute path
            return filename;
        } else { // is relative path
            return path.dirname(ast.source.filename) + "/" + filename;
        }
    })();

    // Refer https://millermedeiros.github.io/mdoc/examples/node_api/doc/path.html#path.normalize
    fullFilename = path.normalize(fullFilename);
    if (!fs.existsSync(fullFilename)) {
        const error = ErrorImportFail(importedFilename);
        error.source = ast.source;
        return fail(error);
    } else {
        return ok(fs.realpathSync(fullFilename) as string);
    }
}

function sortDependency(dependencies: Dependencies): string[] {
    // This step is necessary so that
    // a same file that is depended by multiple files
    // will not be imported more than once
    // (if not there will be performance problem)

    // Sort the vertices topologically, to reveal a legal execution order.
    return toposort(dependencies).reverse();
}

function loadSource(syntaxTrees: SyntaxTree[])
: Maybe<IntermediateRepresentation, ErrorDetail> {
    let ir = initialIntermediateForm();
    for (let i = 0; i < syntaxTrees.length; i++) {
        const s = syntaxTrees[i];
        if (s !== null) {
            const result = getIntermediateRepresentation(s, ir);
            if (isOK(result)) {
                ir = result.value;
            } else {
                result.error.source = s.source;
                return result;
            }
        }
    }
    return ok(ir);
}

function getFunctionDeclarations(ir: IntermediateRepresentation): FunctionDeclaration[]{
    let declarations: FunctionDeclaration[] = [];
    for (const key in ir.symbolTable.funcTab) {
        if (ir.symbolTable.funcTab.hasOwnProperty(key)) {
            declarations = declarations.concat(ir.symbolTable.funcTab[key]);
        }
    }
    return declarations;
}

type Dependencies = string[][]; // Example: [["a.pine", "b.pine"]] means "a.pine" depends on "b.pine"

function Nothing(): string {
    return "";
}

export function loadFile(filename: string): SourceCode | null {
    if (filename === Nothing()) {
        return null;
    }
    return {
        content: fs.readFileSync(filename).toString(),
        filename: filename
    };
}

export interface SourceCode {
    filename: string;
    content: string;
}
