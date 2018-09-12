import { SyntaxTree, ImportDeclaration, Declaration, StringExpression } from "./ast";
import { parseCodeToSyntaxTree } from "./parseCodeToSyntaxTree";
import { tpDeclaration } from "./transpile";
import { raise } from "./fillUpTypeInformation";
import { ErrorImportFail } from "./errorType/E0030-ImportFail";
import { initialIntermediateForm, getIntermediateForm } from "./getIntermediateForm";

import S from 'string';

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
): string {
    try {
        if(loadPreludeLibrary) {
            source.content = `import "$pine/prelude/*"\n` + source.content;
        }
        const initialCache: SyntaxTreeCache = {};
        const ast = parseCodeToSyntaxTree(source);
        initialCache[source.filename] = ast;
        const [dependencies, updatedCache] = extractImports(ast, initialCache);

        const sortedDependencies = sortDependency(dependencies);
        const sortedSyntaxTrees = sortedDependencies.map((x) => updatedCache[x]).filter((x) => x !== undefined);
        const ir = loadSource(sortedSyntaxTrees); // ir means intermediate representation
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
            return "";
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
        let files: string [] = [];


        const repr = importedFiles[i].repr;
        if(S(repr).startsWith('"$')) {
            if(S(repr).startsWith('"$pine/')) {
                const pinelibPath = __dirname + "/../pinelib";
                importedFiles[i].repr = repr.replace("$pine", pinelibPath);
            } else {
                throw new Error(`Cannot handle ${repr} yet`);
            }
        }
        if(S(importedFiles[i].repr).endsWith('*"')) {
            const dirname = importedFiles[i].repr.slice(1, -2);
            if(fs.existsSync(dirname)) {
                files = fs.readdirSync(dirname).filter((x: string) => /[.]pine$/.test(x));
                files = files.map((x) => fs.realpathSync(dirname + "/" + x));
                files = files.filter((x) => fs.lstatSync(x).isFile()); // remove directory names
            } else {
                throw new Error(`Cannot import the directory ${importedFiles[i]}`)
            }
        } else {
            // automaticallyl append file extension
            importedFiles[i].repr = importedFiles[i].repr.slice(0, -1) + '.pine"'; 
            files = [getFullFilename(ast, importedFiles[i])];
        }
        for (let j = 0; j < files.length; j++) {
            const f = loadFile(files[j]);
            if(f !== null) {
                const ast = parseCodeToSyntaxTree(f);
                cache[f.filename] = ast;
                const temp = dependencies.slice();
                [dependencies, cache] = extractImports(ast, cache);
                dependencies = dependencies.concat(temp);
            } else {
                throw new Error("why?");
            }
            dependencies.push([ast.source.filename, /*depends on*/ f.filename]);
        }
    }
    return [dependencies, cache];
}

function getFullFilename(ast: SyntaxTree, importedFilename: StringExpression): string {
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
        return raise(ErrorImportFail(importedFilename), ast.source);
    } else {
        return fs.realpathSync(fullFilename);
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