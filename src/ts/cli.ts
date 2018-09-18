import { renderError, extractFolderName } from "./errorType/renderError";
import { interpret, loadFile, isErrorStackTrace, isErrorDetail, ErrorStackTrace } from "./interpret";
import { isFail } from "./maybeMonad";
import { executeCode } from "./executeCode";
import { justifyLeft, underline } from "./labelLineNumbers";

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
        const result = interpret(file, executeCode, true, true);
        if (isFail(result)) {
            const error = result.error;
            if(isErrorStackTrace(error)) {
                console.log(renderErrorStackTrace(error));
            } else if(isErrorDetail) {
                console.log(renderError(error));
            }
        }
    } else {
        console.log(`Cannot open file '${arg}'.`);
    }
});

export function renderErrorStackTrace(e: ErrorStackTrace): string {
    const path = require("path");
    const chalk = require("chalk");
    const boxen = require("boxen");
    let result = chalk.bold(e.errorType + ":\n\n");
    const numberOfSpaces = 4;
    const numbering = (content: string, arrow = false) => 
        `     ${arrow ? "> " : "  "}| ${justifyLeft(content, numberOfSpaces)} | `;
    const mainScriptPath = extractFolderName(e.stack[e.stack.length - 1].callingFile);
    for (let i = 0; i < e.stack.length; i++) {
        const s = e.stack[i];
        const location = ` [${chalk.yellow(path.relative(mainScriptPath, s.callingFile))}:${s.first_line}:${s.first_column}]`;
        result += `  at  ${chalk.cyan(s.insideWhichFunction)} ${chalk.grey(location)}\n\n`;
        result += `${numbering((s.first_line).toString(), true)}${s.lineContent}\n`;
        result += numbering("") + chalk.red(underline(s.first_column, s.last_column, "~"))
        if(i < e.stack.length - 1)
            result  += "\n\n\n\n";
        
    }
    return boxen(result, {padding: 1, borderColor: "grey", margin: 1});
}