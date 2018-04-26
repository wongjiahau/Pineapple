const parser = require("../jison/pineapple-parser.js");
import { readFileSync } from "fs";
import * as readline from "readline";
import { evalutateExpression, VARIABLES_TABLE } from "./interpreter";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function exec(input: string) {
    return parser.parse(input);
}

function log(message: string) {
    console.log(message);
}

log("Welcome to Pineapple Interactive Shell!");
log("Type ? to list available commands.");

const prompt = () => {
    rl.question("pine>", (response: string) => {
        try {
            if (response === "?") {
                showHelp();
            } else if (response.startsWith(":load")) {
                const file = readFileSync(response.split(" ")[1]);
                file.toString().split("\n").forEach((line, lineNumber) => {
                    evaluateLine(line, lineNumber);
                });
            } else if (response.length > 0) {
                evaluateLine(response, 0);
            }
        } catch (error) {
            log(error.message);
        }
        prompt();
    });

};

function evaluateLine(line: string, lineNumber: number) {
    if (line.indexOf("//<<<") > -1) {
        showDebugTable(lineNumber);
    }
    const statement = line.split("//")[0];
    if (statement.length > 0) {
        const abstractSyntaxTree = exec(statement);
    }
    // log("AST = ");
    // log(abstractSyntaxTree);
    const result = evalutateExpression(abstractSyntaxTree);
    log(JSON.stringify(result));
}

function showDebugTable(lineNumber: number) {
    const cTable = require("console.table");
    log(`Breakpoint encountered at line ${lineNumber}\n`);
    log(`The values of each variable before the executement of line ${lineNumber} are shown below.\n`);
    log("============================");
    console.table(Object.keys(VARIABLES_TABLE).map((key) => {
        return {
            NAME: key,
            TYPE: VARIABLES_TABLE[key].dataType,
            CURRENT_VALUE: VARIABLES_TABLE[key].value
        };
    }));
    pressAnyKeyToContinue();
}

function showHelp() {
    log("Type ':load fileName' to load a Pineapple File.");
}

function pressAnyKeyToContinue() {
    log("Press any key to continue . . .");
    const fs = require("fs");
    const fd = fs.openSync("/dev/stdin", "rs");
    fs.readSync(fd, new Buffer(1), 0, 1);
    fs.closeSync(fd);
}

prompt();
