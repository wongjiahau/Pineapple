import { AtomicToken, TypeExpression } from "../ast";
import { findSimilarStrings } from "../util";
import { ErrorDetail, showSuggestion, stringifyTypeReadable } from "./errorUtil";

export function ErrorUsingUndefinedType(
    relatedType: AtomicToken,
    allTypes: TypeExpression[]
): ErrorDetail {
    const similarTypes = findSimilarStrings(relatedType.repr, allTypes.map((x) => stringifyTypeReadable(x)));
    return {
        code: "0023",
        name: "ErrorUsingUndefinedType",
        message:
`The type ${relatedType.repr} does not exist.
${showSuggestion(similarTypes)}`,
        relatedLocation: relatedType.location
    };
}
