import chalk from "chalk";
import { labelLineNumbers } from "../labelLineNumbers";
import { ErrorDetail } from "./ErrorDetail";
import { logg } from "../fillUpTypeInformation";
const boxen = require("boxen");

export function renderError(
    errorDetail: ErrorDetail,
): string {
    if (errorDetail.source === undefined) {
        return `ERROR: errorDetail.source is not defined. This error is related to ${errorDetail.name}`;
    }
    const sourceCode = errorDetail.source;
    const errorMessageStyle = {borderStyle: "double", padding: 1, borderColor: "red"};
    const sourceCodeStyle = {padding: 1, borderColor: "grey"};
    const hintStyle = {padding: 1, borderColor: "cyan"};

    let result = "";
    result += chalk.bold(errorDetail.name) + `(PINE-${(errorDetail.code)}): \n\n`;
    result += errorDetail.message;
    result = "\n" + boxen(result, errorMessageStyle) + "\n";
    result += boxen(
        labelLineNumbers(
            removeHiddenToken(sourceCode.content),
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
    const pathname = chalk.underline(extractFolderName(sourceCode.filename));
    result += `\nThe error is located at ${filename} from ${pathname} at line ${errorDetail.relatedLocation.first_line}.`;

    return result
        .split("\n")
        .map((x) => "  " + x)
        .join("\n") + "\n";

}

export function extractFilename(path: string): string {
    return path.split("/").slice(-1)[0];
}

export function extractFolderName(path: string): string {
    return path.split("/").slice(0, -1).join("/");
}

export function removeHiddenToken(code: string): string {
    return code.replace(/@[a-zA-Z]+\b/g, "");
}
