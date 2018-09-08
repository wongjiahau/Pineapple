import chalk from "chalk";
import { SourceCode } from "../interpreter";
import { labelLineNumbers } from "../labelLineNumbers";
import { ErrorDetail } from "./errorUtil";
const boxen = require("boxen");

export function renderError(
    sourceCode: SourceCode,
    errorDetail: ErrorDetail,
): string {
    const errorMessageStyle = {borderStyle: "double", padding: 1, borderColor: "red"};
    const sourceCodeStyle = {padding: 1, borderColor: "grey"};
    const hintStyle = {padding: 1, borderColor: "cyan"};

    let result = "";
    result += chalk.bold(errorDetail.name) + `(PINE-${(errorDetail.code)}): \n\n`;
    result += errorDetail.message;
    result = "\n" + boxen(result, errorMessageStyle) + "\n";
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
    const filename = chalk.underline(extractFilename(sourceCode.filename));
    const pathname = chalk.underline(extractPathname(sourceCode.filename));
    result += `\nThe error is located at ${filename} from ${pathname} at line ${errorDetail.relatedLocation.first_line}.`;

    return result
        .split("\n")
        .map((x) => "  " + x)
        .join("\n") + "\n";

}

export function extractFilename(path: string): string {
    return path.split("/").slice(-1)[0];
}

export function extractPathname(path: string): string {
    return path.split("/").slice(0, -1).join("/");
}