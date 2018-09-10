const toposort = require("toposort");
const vm = require("vm");
import {Declaration, ImportDeclaration, SyntaxTree} from "./ast";
import {getIntermediateForm, initialIntermediateForm} from "./getIntermediateForm";
import {tpDeclaration} from "./transpile";
import { parseCodeToSyntaxTree } from "./parseCodeToSyntaxTree";
import { raise } from "./fillUpTypeInformation";
import { ErrorImportFail } from "./errorType/E0030-ImportFail";
const clear = require("clear");
const path = require("path");

const VERSION = require("../package.json").version;

const program = require("commander");
program
    .version(VERSION)
    .option("-l, --log", "Log output")
    .parse(process.argv);

if (program.log) {
    console.log("Logging");
}

if (program.args.length === 0) {
    console.log(`Pineapple ${VERSION}`);
}

const fs = require("fs");

type SyntaxTreeCache = {[filename: string]: SyntaxTree}
program.args.forEach((arg: string) => {
    try {
        const file = loadFile(arg);
        if (file === null) {
            throw new Error(`Cannot open file ${arg}`);
        }
        const initialCache: SyntaxTreeCache = {};
        const ast = parseCodeToSyntaxTree(file);
        initialCache[file.filename] = ast;
        const [dependencies, updatedCache] = extractImports(ast, initialCache);

        const sortedDependencies = sortDependency(dependencies);
        const sortedSyntaxTrees = sortedDependencies.map((x) => updatedCache[x]);
        const ir = loadSource(sortedSyntaxTrees); // ir means intermediate representation
        // dependencies of prelude library
        // const preludeDependencies = loadPreludeScript(file.filename);

        // dependencies of user scripts
        // const scriptDependencies = loadDependency(file);

        // const _sortedDependencies = sortDependency(preludeDependencies).concat(sortDependency(scriptDependencies));
        // const _allCodes = sortedDependencies.map(loadFile);
        // const _ir = loadSource(allCodes); // ir means intermediate representation
        let transpiledCode = ir.map(tpDeclaration).join("\n");
        transpiledCode += "if(typeof _main_ === 'function')_main_()";
        execute(transpiledCode);
    } catch (error) {
        if (error.name[0] === "#") { // if this error is processed
            clear();
            console.log(error.message);
        } else { // if this error is not processed, means it is a compiler's bug
            error.name += "(This is possibly a compiler internal error)";
            console.log(error);
        }
    }
});

function extractImports(ast: SyntaxTree, cache: SyntaxTreeCache)
: [Dependencies, SyntaxTreeCache] {
    let dependencies: Dependencies = [];

    const importedFiles = (ast.declarations
        .filter((x) => x.kind === "ImportDeclaration") as ImportDeclaration[])
        .map((x) => x.filename);
    
    for (let i = 0; i < importedFiles.length; i++) {
        const filename = importedFiles[i].repr.slice(1, -1);
        if(!fs.existsSync(filename)) {
            return raise(ErrorImportFail(importedFiles[i]), ast.source);
        } else {
            const file = loadFile(filename);
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
    }
    return [dependencies, cache];
}


function getFullFilePath(filename: string): string {
    // Refer https://millermedeiros.github.io/mdoc/examples/node_api/doc/path.html#path.normalize
    return path.normalize(fs.realpathSync(filename));
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

function execute(javascriptCode: string): void {
    // use strict is added to improve performance
    // See https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
    let code = `"use strict";`;

    // This step is necessary because `require` is not defined, so we need to pass in the context
    // Refer https://nodejs.org/api/vm.html#vm_example_running_an_http_server_within_a_vm
    code += `((require) => {${javascriptCode}})`;
    vm.runInThisContext(code)(require);
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
        filename: getFullFilePath(filename)
    };
}

export interface SourceCode {
    filename: string;
    content: string;
}
