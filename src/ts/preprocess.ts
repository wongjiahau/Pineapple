import { labelIndentation } from "./labelIndentation";
import { labelNewlines } from "./labelNewlines";
import { smoothify } from "./smoothify";

export function preprocess(input: string): string {
    let result = input.replace(/(\r\n|\r|\n)+/g, "\n");
    result += "\n";
    result = labelNewlines(result);
    result = smoothify(result);
    result = labelIndentation(result);
    result += "@EOF";
    // console.log(labelLineNumbers(result));
    return result;
}

export function labelLineNumbers(input: string): string {
    let result = "";
    const lines = input.split("\n");
    for (let i = 0; i < lines.length; i++) {
        result += `| ${justifyLeft((i + 1).toString(), (lines.length + 1).toString().length)} | ${lines[i]}` + "\n";
    }
    return result;
}

function justifyLeft(input: string, numberOfSpaces: number): string {
    let result = input;
    for (let i = input.length; i < numberOfSpaces; i++) {
       result = " " + result;
    }
    return result;
}
