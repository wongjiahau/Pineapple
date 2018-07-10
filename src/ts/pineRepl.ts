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
    const source = loadLibraryFunctions();
    output += pine2js(source + readFile(arg));
    output += "\n_main();"; // Call the main function
    console.log(output);
});

function readFile(filename: string): string {
    return fs.readFileSync(filename).toString();
}

function loadLibraryFunctions(): string {
    const CORE_LIBRARY_DIRECTORY = "../corelib/";
    return fs.readdirSync(CORE_LIBRARY_DIRECTORY).map((x: string) => {
        const content = readFile(CORE_LIBRARY_DIRECTORY + x);
        return content;
    }).join("\n");
}

function loadPrimitiveTypes(): string {
    return `
    class ArrayOfNumber extends Array {
        constructor(xs) {super(...xs)}
    }
`;
}
