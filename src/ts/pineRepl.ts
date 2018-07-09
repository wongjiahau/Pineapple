import { pine2js } from "./pine2js";

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
    let output = loadPrimitiveTypes();
    output += loadLibraryFunctions();
    output += transpileSourceFile(arg);
    output += "\n_main();"; // Call the main function
    console.log(output);
});

function transpileSourceFile(filename: string): string {
    const content = fs.readFileSync(filename).toString();
    return pine2js(content);
}

function loadLibraryFunctions(): string {
    const CORE_LIBRARY_DIRECTORY = "../corelib/";
    return fs.readdirSync(CORE_LIBRARY_DIRECTORY).map((x: string) => {
        return transpileSourceFile(CORE_LIBRARY_DIRECTORY + x);
    }).join("\n");
}

function loadPrimitiveTypes(): string {
    return `
`;
}
