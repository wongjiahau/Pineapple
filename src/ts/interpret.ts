import { SyntaxTree, ImportDeclaration, Declaration, StringExpression } from "./ast";
import { parseCodeToSyntaxTree } from "./parseCodeToSyntaxTree";
import { tpDeclaration } from "./transpile";
import { raise } from "./fillUpTypeInformation";
import { ErrorImportFail } from "./errorType/E0030-ImportFail";
import { initialIntermediateForm, getIntermediateForm } from "./getIntermediateForm";

const clear    = require("clear");
const fs       = require("fs");
const path     = require("path");
const toposort = require("toposort");

type SyntaxTreeCache = {[filename: string]: SyntaxTree}

type CodeExecuter = (code: string) => string;

export type ErrorHandler = (e: Error) => void;

export function interpret(source: SourceCode, execute: CodeExecuter, rethrowError: boolean): string {
    try {
        const initialCache: SyntaxTreeCache = {};
        const ast = parseCodeToSyntaxTree(source);
        initialCache[source.filename] = ast;
        const [dependencies, updatedCache] = extractImports(ast, initialCache);

        const sortedDependencies = sortDependency(dependencies);
        const sortedSyntaxTrees = sortedDependencies.map((x) => updatedCache[x]).filter((x) => x !== undefined);
        const ir = loadSource(sortedSyntaxTrees); // ir means intermediate representation
        // dependencies of prelude library
        // const preludeDependencies = loadPreludeScript(file.filename);

        // dependencies of user scripts
        // const scriptDependencies = loadDependency(file);

        // const _sortedDependencies = sortDependency(preludeDependencies).concat(sortDependency(scriptDependencies));
        // const _allCodes = sortedDependencies.map(loadFile);
        // const _ir = loadSource(allCodes); // ir means intermediate representation
        const transpiledCode = ir.map(tpDeclaration).join("\n");
        return execute(transpiledCode);
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
        }
    }
}

function extractImports(ast: SyntaxTree, cache: SyntaxTreeCache)
: [Dependencies, SyntaxTreeCache] {

    let dependencies: Dependencies = [
        [ast.source.filename, /*depends on */ Nothing()]
    ];

    const importedFiles = (ast.declarations
        .filter((x) => x.kind === "ImportDeclaration") as ImportDeclaration[])
        .map((x) => x.filename);
    
    for (let i = 0; i < importedFiles.length; i++) {
        const fullFilename = getFullFilePath(ast, importedFiles[i]);
        const file = loadFile(fullFilename);
        if(file !== null) {
            const ast = parseCodeToSyntaxTree(file);
            cache[file.filename] = ast;
            const temp = dependencies.slice();
            [dependencies, cache] = extractImports(ast, cache);
            dependencies = dependencies.concat(temp);
        } else {
            throw new Error("why?");
        }
        dependencies.push([ast.source.filename, /*depends on*/ file.filename]);
    }
    return [dependencies, cache];
}


function getFullFilePath(ast: SyntaxTree, importedFilename: StringExpression): string {
    const filename = importedFilename.repr.slice(1, -1);
    const fullFilename = path.dirname(ast.source.filename) + "/" + filename;
    if(!fs.existsSync(fullFilename)) {
        return raise(ErrorImportFail(importedFilename), ast.source);
    } else {
        // Refer https://millermedeiros.github.io/mdoc/examples/node_api/doc/path.html#path.normalize
        return path.normalize(fs.realpathSync(fullFilename));
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

function loadSource(syntaxTrees: Array<SyntaxTree>): Declaration[] {
    let result = initialIntermediateForm();
    for (let i = 0; i < syntaxTrees.length; i++) {
        const s = syntaxTrees[i];
        if (s !== null) {
            result = getIntermediateForm(s, result);
        }
    }
    let declarations: Declaration[] = [];
    for (const key in result.symbolTable.funcTab) {
        if (result.symbolTable.funcTab.hasOwnProperty(key)) {
            declarations = declarations.concat(result.symbolTable.funcTab[key]);
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