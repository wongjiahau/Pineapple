import { Declaration } from "./ast";
import { getIntermediateForm, initialIntermediateForm } from "./getIntermediateForm";
import { tpDeclaration } from "./transpile";

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
        interpret(arg);
    } catch (error) {
        console.log(error.errorMessage.message);
    }
});

function loadSource(sources: SourceCode[]): Declaration[] {
    let result = initialIntermediateForm();
    for (let i = 0; i < sources.length; i++) {
        result = getIntermediateForm(sources[i], result);
    }
    return result.syntaxTrees;
}

function interpret(filename: string): void {
    const source  = loadFile(filename);
    const libraries = loadLibraryFunctions();
    libraries.push(source);
    const syntaxTrees = loadSource(libraries);
    let output    = loadPrimitiveTypes();
    output += syntaxTrees.map((x) => tpDeclaration(x)).join("\n");
    output       += "\n_main_();"; // Call the main function
    fs.writeFileSync("__temp__.pine.js", output);
    exec("node __temp__.pine.js", (err, stdout, stderr) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            console.log(stdout);
            console.log(stderr);
        }
    });
}

function loadFile(filename: string): SourceCode {
    return {
        content: fs.readFileSync(filename).toString(),
        filename: filename
    };
}

function loadLibraryFunctions(): SourceCode[] {
    const CORE_LIBRARY_DIRECTORY = "../corelib/";
    return fs.readdirSync(CORE_LIBRARY_DIRECTORY).map((x: string) => {
        return loadFile(CORE_LIBRARY_DIRECTORY + x);
    });
}

function loadPrimitiveTypes(): string {
    return `
    class ArrayOfNumber extends Array {
        constructor(xs) {super(...xs)}
    }
`;
}

export interface SourceCode {
    filename: string;
    content: string;
}
