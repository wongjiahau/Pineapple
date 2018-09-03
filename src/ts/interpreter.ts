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
program.args.forEach((arg: string) => {
    try {
        const dependencies = loadPreludeScript(arg).concat(loadDependency(loadFile(arg)));
        const sortedDependencies = sortDependency(dependencies);
        const allCodes = sortedDependencies.map(loadFile);
        const ir = loadSource(allCodes); // ir means intermediate representation
        const transpiledCode = ir.map(tpDeclaration).join("\n") + "\n_main_();";
        execute(transpiledCode);
    } catch (error) {
        clear();
        // console.log(error);
        console.log(error.message);
    }
});

function loadPreludeScript(currentFile: string): Dependencies {
    let dependencies: Dependencies = [];
    const PRELUDE_DIR = "./pinelib/prelude/";
    fs.readdirSync(PRELUDE_DIR).forEach((filename: string) => {
        const libFile = fs.realpathSync(PRELUDE_DIR + filename);
        dependencies.push([currentFile, /*depends on*/ libFile]);
        dependencies = dependencies.concat(loadDependency(loadFile(libFile)));
    });
    return dependencies;
}

function sortDependency(dependencies: Dependencies): string[] {
    // This step is necessary so that
    // a same file that is depended by multiple files
    // will not be imported more than once
    // (if not there will be performance problem)

    // Sort the vertices topologically, to reveal a legal execution order.
    return toposort(dependencies).reverse();
}

function loadSource(sources: Array<SourceCode | null>): Declaration[] {
    let result = initialIntermediateForm();
    for (let i = 0; i < sources.length; i++) {
        const s = sources[i];
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

function loadDependency(initSource: SourceCode | null): Dependencies {
    if (initSource === null) {
        return [];
    }
    let imports = initSource.content.match(/(\n|^)import[ ]".+"/g) as string[];
    const currentFile = fs.realpathSync(initSource.filename);
    const filepath = currentFile.split("/").slice(0, -1).join("/") + "/";
    let dependencies: string[][] = [];

    if (imports === null) {
        dependencies.push([initSource.filename, /*depends on*/ Nothing()]);
        return dependencies;
    } else {
        imports = imports.map((x) => {
            const stringWithinQuotes = x.match(/".+"/g);
            if (stringWithinQuotes === null) {
                throw new Error(`Cannot extract filename from ${x}`);
            } else {
                return stringWithinQuotes[0].slice(1, -1);
            }
        });
        // import user-defined scripts
        for (let i = 0; i < imports.length; i++) {
            const importedFile = fs.realpathSync(filepath + imports[i]);
            dependencies.push([currentFile, /*depends on*/ importedFile]);
            dependencies = dependencies.concat(loadDependency(loadFile(importedFile)));
        }
        return dependencies;
    }
}

export function loadFile(filename: string): SourceCode | null {
    if (filename === Nothing()) {
        return null;
    }
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
