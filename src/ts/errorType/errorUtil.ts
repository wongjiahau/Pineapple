import chalk from "chalk";
import { TokenLocation } from "../ast";
import { SourceCode } from "../interpreter";
import { labelLineNumbers } from "../labelLineNumbers";
const boxen = require("boxen");

export interface ErrorDetail  {
    message: string;
    relatedLocation: TokenLocation;
}

export function renderError(
    sourceCode: SourceCode,
    errorDetail: ErrorDetail,
): string {
    const errorMessageStyle = {borderStyle: "double", padding: 1, borderColor: "red"};
    const sourceCodeStyle = {padding: 1, borderColor: "cyan"};

    let result = "\n";
    result += boxen(chalk.bold("ERROR: ") + errorDetail.message, errorMessageStyle) + "\n";
    result += boxen(labelLineNumbers(sourceCode.content, errorDetail.relatedLocation.first_line), sourceCodeStyle);
    result += `\nThe error is located at ${chalk.underline(sourceCode.filename)} at line ${errorDetail.relatedLocation.first_line}.`;

    return result
        .split("\n")
        .map((x) => "  " + x)
        .join("\n") + "\n";

}
