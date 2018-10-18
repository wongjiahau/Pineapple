import nodeChalk, { Chalk } from "chalk";
import { TokenLocation } from "./ast";

export function labelLineNumbers(
    input: string,
    location: TokenLocation,
    range: number = 5,
    chalk: Chalk = nodeChalk
): string {
    let result = "";
    let lines = input.split("\n");
    const marginLeft = "            ";
    const pointingWhichLine = location.first_line;
    const numberOfSpaces = (lines.length + 1).toString().length;
    const startLine = (pointingWhichLine - range) > 0 ? (pointingWhichLine - range) : 0;
    const endLine = pointingWhichLine + range >= lines.length ? lines.length : pointingWhichLine + range;
    lines = lines.slice(startLine, endLine);
    for (let i = 0; i < lines.length; i++) {
        // tslint:disable-next-line:max-line-length
        const numbering = (content: string) => `| ${justifyLeft(content, numberOfSpaces)} | `;
        let line = `${numbering((i + 1 + startLine).toString())}${lines[i]}`;
        line = line.trimRight() + "\n";
        if (pointingWhichLine - startLine - 1 === i) {
            line = chalk.bgRed("    ERROR >>" + line);
            line += marginLeft
                + numbering("")
                + chalk.redBright(underline(location.first_column, location.last_column)) + "\n";
        } else {
            line = marginLeft + line;
        }
        result += line;
    }
    return result;
}

// tslint:disable-next-line:variable-name
export function underline(first_column: number, last_column: number, marker = "^"): string {
    let result = "";
    for (let i = 0; i < last_column; i++) {
        if (i > first_column - 1) {
            result += marker ;
        } else {
            result += " ";
        }
    }
    return result;
}

export function justifyLeft(input: string, numberOfSpaces: number): string {
    if (numberOfSpaces < input.length) {
        throw new Error("Input length should be more than or equal number of spaces.");
    }
    let result = input;
    for (let i = input.length; i < numberOfSpaces; i++) {
       result = " " + result;
    }
    return result;
}
