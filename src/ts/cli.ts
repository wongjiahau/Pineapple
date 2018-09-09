const toposort = require("toposort");
const vm = require("vm");
import {Declaration} from "./ast";
import {getIntermediateForm, initialIntermediateForm} from "./getIntermediateForm";
import {tpDeclaration} from "./transpile";
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
program.args.forEach((arg: string) => {
    try {
        const file = loadFile(arg);
        if (file === null) {
            throw new Error(`Cannot open file ${arg}`);
        }

        // dependencies of prelude library
        const preludeDependencies = loadPreludeScript(file.filename);

        // dependencies of user scripts
        const scriptDependencies = loadDependency(file);

        const sortedDependencies = sortDependency(preludeDependencies).concat(sortDependency(scriptDependencies));
        const allCodes = sortedDependencies.map(loadFile);
        const ir = loadSource(allCodes); // ir means intermediate representation
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

function loadPreludeScript(currentFile: string): Dependencies {
    let dependencies: Dependencies = [];
    const PRELUDE_DIR = __dirname + "/../pinelib/prelude/";
    fs.readdirSync(PRELUDE_DIR).forEach((filename: string) => {
        const libFile = getFullFilePath(PRELUDE_DIR + filename);
        dependencies.push([currentFile, /*depends on*/ libFile]);
        dependencies = dependencies.concat(loadDependency(loadFile(libFile)));
    });
    return dependencies;
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

/**
 * This function is to get the filename from a fullFilename
 */
function filename(fullFilename: string) {
    return path.basename(fullFilename, path.extname(fullFilename));
}

function loadDependency(initSource: SourceCode | null): Dependencies {
    if (initSource === null) {
        return [];
    }
    let imports = initSource.content.match(/(\n|^)import[ ]".+"/g) as string[];
    const currentFile = getFullFilePath(initSource.filename);

    const dirname = path.dirname(currentFile) + "/";
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
            const importedFile = getFullFilePath(dirname + imports[i]);
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
        filename: getFullFilePath(filename)
    };
}

export interface SourceCode {
    filename: string;
    content: string;
}
