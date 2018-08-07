import chalk from "chalk";
import { TokenLocation } from "./ast";

export function labelLineNumbers(
    input: string,
    location: TokenLocation,
    range: number = 5
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
            line += marginLeft + numbering("") + chalk.white(renderPointer(location)) + "\n";
        } else {
            line = marginLeft + line;
        }
        result += line;
    }
    return result;
}

function renderPointer(location: TokenLocation): string {
    let result = "";
    for (let i = 0; i < location.last_column; i++) {
        if (i >= location.first_column - 1) {
            result += "^" ;
        } else {
            result += " ";
        }
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
