import { AtomicToken } from "../ast";
import { findSimilarStrings } from "../util";
import { ErrorDetail, showSuggestion } from "./errorUtil";

export function ErrorUsingUndefinedEnum(
    e: AtomicToken,
    allEnums: AtomicToken[]
): ErrorDetail {
    const similarEnum = findSimilarStrings(e.repr, allEnums.map((x) => x.repr));
    return {
        code: "0020",
        name: "ErrorUsingUndefinedEnum",
        message:
`You cannot use the enum ${e.repr} as it does not exist.
${showSuggestion(similarEnum)}`,
        relatedLocation: e.location
    };
}
