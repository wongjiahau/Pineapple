import chalk from "chalk";
import { TokenLocation } from "../ast";
import { SourceCode } from "../interpreter";
import { labelLineNumbers } from "../labelLineNumbers";
const boxen = require("boxen");

export interface ErrorDetail  {
    name: string;
    message: string;
    relatedLocation: TokenLocation;
    hint?: string;
}

export function renderError(
    sourceCode: SourceCode,
    errorDetail: ErrorDetail,
): string {
    const errorMessageStyle = {borderStyle: "double", padding: 1, borderColor: "red"};
    const sourceCodeStyle = {padding: 1, borderColor: "grey"};
    const hintStyle = {padding: 1, borderColor: "cyan"};

    let result = "\n";
    result += boxen(chalk.bold("ERROR: ") + errorDetail.message, errorMessageStyle) + "\n";
    result += boxen(
        labelLineNumbers(
            sourceCode.content,
            errorDetail.relatedLocation,
            3
        ),
        sourceCodeStyle
    );
    if (errorDetail.hint) {
        result += "\n" + boxen(chalk.bold("HINT:") + "\n\n" + errorDetail.hint, hintStyle);
    }
    // tslint:disable-next-line:max-line-length
    result += `\nThe error is located at ${chalk.underline(sourceCode.filename)} at line ${errorDetail.relatedLocation.first_line}.`;

    return result
        .split("\n")
        .map((x) => "  " + x)
        .join("\n") + "\n";

}
