import { SyntaxTree, ImportDeclaration, Declaration, StringExpression } from "./ast";
import { parseCodeToSyntaxTree, UnkwownError } from "./parseCodeToSyntaxTree";
import { tpDeclaration } from "./transpile";
import { Maybe, ok, isOK, isFail, fail } from "./fillUpTypeInformation";
import { ErrorImportFail } from "./errorType/E0030-ImportFail";
import { initialIntermediateForm, getIntermediateForm } from "./getIntermediateForm";
import { endsWith, startsWith } from "./util";
import { ErrorDetail } from "./errorType/errorUtil";

const clear    = require("clear");
const fs       = require("fs");
const path     = require("path");
const toposort = require("toposort");

type SyntaxTreeCache = {[filename: string]: SyntaxTree}

type CodeExecuter = (code: string) => string;

export type ErrorHandler = (e: Error) => void;

export function interpret(
    source: SourceCode, 
    execute: CodeExecuter, 
    rethrowError: boolean, 
    loadPreludeLibrary: boolean
): Maybe<string, ErrorDetail> {
    try {
        if(loadPreludeLibrary) {
            source.content = `import "$pine/prelude/*"\n` + source.content;
        }
        const initialCache: SyntaxTreeCache = {};
        const parsedCode = parseCodeToSyntaxTree(source);
        if(isFail(parsedCode)) return parsedCode;
        const ast = parsedCode.value;
        initialCache[source.filename] = ast;
        const extractResult = extractImports(ast, initialCache);
        if(isFail(extractResult)) return extractResult;
        const [dependencies, updatedCache] = extractResult.value;

        const sortedDependencies = sortDependency(dependencies);
        const sortedSyntaxTrees = sortedDependencies.map((x) => updatedCache[x]).filter((x) => x !== undefined);
        const result = loadSource(sortedSyntaxTrees); // ir means intermediate representation
        if(isOK(result)) {
            const ir = result.value;
            const transpiledCode = ir.map(tpDeclaration).join("\n");
            return ok(execute(transpiledCode));
        } else {
            return result;
        }
    } catch (error) {
        if(rethrowError) {
            throw error;
        } else {
            if (error.name[0] === "#") { // if this error is processed
                clear();
                console.log(error.message);
            } else { // if this error is not processed, means it is a compiler's bug
                error.name += "(This is possibly a compiler internal error)";
                console.log(error);
            }
            return fail(UnkwownError(""));
        }
    }
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
        if(startsWith(repr, '"$')) {
            if(startsWith(repr, '"$pine/')) {
                const pinelibPath = __dirname + "/../pinelib";
                importedFiles[i].repr = repr.replace("$pine", pinelibPath);
            } else {
                throw new Error(`Cannot handle ${repr} yet`);
            }
        }
        if(endsWith(importedFiles[i].repr, '*"')) {
            const dirname = importedFiles[i].repr.slice(1, -2);
            if(fs.existsSync(dirname)) {
                files = fs.readdirSync(dirname).filter((x: string) => /[.]pine$/.test(x));
                files = files.map((x) => fs.realpathSync(dirname + "/" + x));
                files = files.filter((x) => fs.lstatSync(x).isFile()); // remove directory names
            } else {
                throw new Error(`Cannot import the directory ${importedFiles[i].repr}`)
            }
        } else {
            // automaticallyl append file extension
            importedFiles[i].repr = importedFiles[i].repr.slice(0, -1) + '.pine"'; 

            const result = getFullFilename(ast, importedFiles[i])
            if(isFail(result)) return result;

            files = [result.value];
        }
        for (let j = 0; j < files.length; j++) {
            const f = loadFile(files[j]);
            if(f !== null) {
                const parsedCode = parseCodeToSyntaxTree(f);
                if(!isOK(parsedCode)) return parsedCode;
                const ast = parsedCode.value;
                cache[f.filename] = ast;
                const temp = dependencies.slice();
                const extractResult = extractImports(ast, cache);
                if(isFail(extractResult)) return extractResult;
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
        if(importedFilename.repr[1] === "/") { // if is absolute path
            return filename;
        } else { // is relative path
            return path.dirname(ast.source.filename) + "/" + filename;
        }
    })();
    
    // Refer https://millermedeiros.github.io/mdoc/examples/node_api/doc/path.html#path.normalize
    fullFilename = path.normalize(fullFilename);
    if(!fs.existsSync(fullFilename)) {
        console.log(fullFilename);
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

function loadSource(syntaxTrees: Array<SyntaxTree>)
: Maybe<Declaration[], ErrorDetail> {
    let ir = initialIntermediateForm();
    for (let i = 0; i < syntaxTrees.length; i++) {
        const s = syntaxTrees[i];
        if (s !== null) {
            const result = getIntermediateForm(s, ir);
            if(result.kind === "OK") {
                ir = result.value;
            } else {
                result.error.source = s.source;
                return result;
            }
        }
    }
    let declarations: Declaration[] = [];
    for (const key in ir.symbolTable.funcTab) {
        if (ir.symbolTable.funcTab.hasOwnProperty(key)) {
            declarations = declarations.concat(ir.symbolTable.funcTab[key]);
        }
    }
    return ok(declarations);
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