import { TokenLocation } from "../ast";
import { SourceCode } from "../interpreter";
import { labelLineNumbers } from "../labelLineNumbers";

export interface ErrorDetail  {
    message: string;
    relatedLocation: TokenLocation;
}

export function renderError(
    sourceCode: SourceCode,
    errorDetail: ErrorDetail,
): string {
    let result = "\n";
    result += "ERROR >>> \n\n\t";
    result += errorDetail.message + "\n\n";
    result += labelLineNumbers(sourceCode.content, errorDetail.relatedLocation.first_line) + "\n";
    result += `The error is located at '${sourceCode.filename}' at line ${errorDetail.relatedLocation.first_line}.`;

    return result
        .split("\n")
        .map((x) => "  " + x)
        .join("\n") + "\n";

}
