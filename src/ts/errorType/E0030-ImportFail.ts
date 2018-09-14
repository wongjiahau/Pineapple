import { StringExpression } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorImportFail(
    filename: StringExpression
): ErrorDetail {
    return {
        name: "ErrorImportFail",
        code: "0030",
        message: `Cannot import ${filename.repr}`,
        relatedLocation: filename.location,
        hint:
`Several possible reasons:

    1. The file does not exist
    2. You typed the filename wrongly
    3. You do not have permission to the file
    4. The given path is a folder
`
    };
}
