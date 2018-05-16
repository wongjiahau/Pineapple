const parser = require("../jison/pineapple-parser.js");
import { readFileSync } from "fs";
import * as readline from "readline";
import { addBrackets } from "./addBrackets";
import { addSemicolon } from "./addSemicolon";
import { evalutateExpression, ExpressionNode, VARIABLES_TABLE } from "./interpreter";
import { smoothify } from "./smoothify";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function exec(input: string) {
    return parser.parse(input);
}

function log(message: object | string) {
    if (typeof message === "string") {
        console.log(message);
        return;
    }
    console.log(JSON.stringify(message, null, 2));
}

// log("Welcome to Pineapple Interactive Shell!");
// log("Type ? to list available commands.");

const prompt = () => {
    rl.question("pine>", (response: string) => {
        try {
            if (response === "?") {
                showHelp();
            } else if (response.startsWith(":load")) {
                const file = readFileSync(response.split(" ")[1]);
                evaluateInput(file.toString(), 0);
                // const result = evaluateMultipleLines(file.toString().split("\n"));
                // result.forEach((x: any) => {
                //     log(x);
                // });
            } else if (response.length > 0) {
                evaluateInput(response, 0);
            }
        } catch (error) {
            log(error.message);
        }
        prompt();
    });

};

function evaluateInput(input: string, lineNumber: number) {
    if (input.indexOf("//<<<") > -1) {
        showDebugTable(lineNumber);
    }
    interpret(input);
}

export function preprocess(input: string): string {
    const bracketized = addBrackets(input);
    const addedSemicolon = addSemicolon(bracketized);
    const smoothifized = smoothify(addedSemicolon);
    return smoothifized;
}

export function interpret(input: string, printOutput = false): any {
    const abstractSyntaxTree = exec(preprocess(input));
    const result = evalutateExpression(abstractSyntaxTree);
    if (printOutput) {
        log("AST = ");
        log(abstractSyntaxTree);
        log(result);
    }
    return result;
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
