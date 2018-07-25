import { Declaration } from "./ast";
import { PineError } from "./errorType";
import { ErrorMessage } from "./generateErrorMessage";
import { getIntermediateForm, initialIntermediateForm } from "./getIntermediateForm";
import { labelLineNumbers } from "./labelLineNumbers";
import { labelNewlines } from "./labelNewlines";
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
        const output = renderErrorMessage((error as PineError).errorMessage);
        console.log(output);
    }
});

function renderErrorMessage(e: ErrorMessage): string {
    let result = "\n";
    result += "ERROR >>> \n\n\t";
    result += e.message + "\n\n";
    result += labelLineNumbers(e.relatedSourceCode, e.location.first_line) + "\n";
    result += `The error is located at '${e.filename}' at line ${e.location.first_line}.`;
    return result.split("\n").map((x) => "  " + x).join("\n") + "\n";
}

function loadSource(sources: SourceCode[]): Declaration[] {
    let result = initialIntermediateForm();
    for (let i = 0; i < sources.length; i++) {
        result = getIntermediateForm(sources[i], result);
    }
    let declarations: Declaration[] = [];
    for (var key in result.funcTab) {
        declarations = declarations.concat(result.funcTab[key]);
    }
    return declarations;
}

function interpret(filename: string): void {
    const source      = loadFile(filename);
    const libraries   = loadLibraryFunctions();
    libraries.push(source);
    const declarations = loadSource(libraries);
    let output        = loadPrimitiveTypes();
    output += declarations.map((x) => tpDeclaration(x)).join("\n");
    // console.log(output);
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
`;
}

export interface SourceCode {
    filename: string;
    content: string;
}
