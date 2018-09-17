import { renderError } from "./errorType/renderError";
import { interpret, loadFile } from "./interpret";
import { isFail } from "./maybeMonad";
import { executeCode } from "./executeCode";

const fs = require("fs");
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

program.args.forEach((arg: string) => {
    if (fs.existsSync(arg)) {
        const file = loadFile(fs.realpathSync(arg));
        if (file === null) {
            throw new Error(`Cannot open file ${arg}`);
        }
        const result = interpret(file, executeCode, true);
        if (isFail(result)) {
            console.log(renderError(result.error));
        }
    } else {
        console.log(`Cannot open file '${arg}'.`);
    }
});
