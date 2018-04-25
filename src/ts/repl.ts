function exec(input: string) {
    return require("../jison/pineapple-parser.js").parse(input);
}

import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = () => {
    rl.question("pine>", (answer: string) => {
        try {
            exec(answer);
        } catch (error) {
            console.log(error.message);
        }
        prompt();
    });

};

prompt();
