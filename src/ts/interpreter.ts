const toposort = require("toposort");
const vm = require("vm");
import {Declaration} from "./ast";
import {getIntermediateForm, initialIntermediateForm} from "./getIntermediateForm";
import {tpDeclaration} from "./transpile";
const clear = require("clear");

const program = require("commander");
program
    .version("0.1.0")
    .option("-l, --log", "Log output")
    .parse(process.argv);

if (program.log) {
    console.log("Logging");
}

const fs = require("fs");
const {exec} = require("child_process");
program.args.forEach((arg: string) => {
        try {
            const transpiledCode = fullTranspile(loadFile(arg));
            execute(transpiledCode);
        } catch (error) {
            clear();
            console.log(error.message);
        }
    });

function loadSource(sources: SourceCode[]): Declaration[] {
    let result = initialIntermediateForm();
    for (let i = 0; i < sources.length; i++) {
        result = getIntermediateForm(sources[i], result);
    }
    let declarations: Declaration[] = [];
    for (const key in result.symbolTable.funcTab) {
        if (result.symbolTable.funcTab.hasOwnProperty(key)) {
            declarations = declarations.concat(result.symbolTable.funcTab[key]);
        }
    }
    return declarations;
}

export function fullTranspile(source: SourceCode): string {
    // Get the dependencies of each file
    const dependencies = loadDependency(source);

    let sources: SourceCode[] = [];
    if (dependencies.length > 0) {
        // Now, sort the vertices topologically, to reveal a legal execution order.
        const sortedDependencies: string[] = toposort(dependencies).reverse();

        // Transpile the code according to execution order
        sources = sortedDependencies.map(loadFile);
    } else {
        // If no dependecy is found
        sources = [source];
    }

    return loadSource(sources)
        .map((x) => tpDeclaration(x))
        .join("\n")
        + "\n_main_();";
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

function loadDependency(initSource: SourceCode): Dependencies {
    let imports = initSource.content.match(/(\n|^)import[ ]".+"/g) as string[];
    const currentFile = fs.realpathSync(initSource.filename);
    const filepath = currentFile.split("/").slice(0, -1).join("/") + "/";
    if (imports === null) {
        return [];
    } else {
        imports = imports.map((x) => x.match(/".+"/g)[0].slice(1, -1));
        let dependencies: string[][] = [];
        for (let i = 0; i < imports.length; i++) {
            const importedFile = fs.realpathSync(filepath + imports[i]);
            dependencies.push([currentFile, /*depends on*/ importedFile]);
            dependencies = dependencies.concat(loadDependency(loadFile(importedFile)));
        }
        return dependencies;
    }
}

export function loadFile(filename: string): SourceCode {
    return {
        content: fs
            .readFileSync(filename)
            .toString(),
        filename: filename
    };
}

export interface SourceCode {
    filename: string;
    content: string;
}
