const parser = require("../jison/pineapple-parser.js");
import * as readline from "readline";
import { evalutateExpression } from "./interpreter";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function exec(input: string) {
    return parser.parse(input);
}

const prompt = () => {
    rl.question("pine>", (answer: string) => {
        try {
            if (answer.length > 0) {
                const abstractSyntaxTree = exec(answer);
                console.log("AST = ");
                console.log(abstractSyntaxTree);
                // console.log("\n");
                const result = evalutateExpression(abstractSyntaxTree);
                console.log(result);
            }
        } catch (error) {
            console.log(error.message);
        }
        prompt();
    });

};

prompt();
