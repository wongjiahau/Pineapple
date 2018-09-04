import { AtomicToken } from "../ast";
import { SymbolTable } from "../fillUpTypeInformation";
import { flattenTree } from "../typeTree";
import { findSimilarStrings, values } from "../util";
import { ErrorDetail, showSuggestion, stringifyTypeReadable } from "./errorUtil";

export function ErrorUsingUndefinedType(
    relatedType: AtomicToken,
    symbols: SymbolTable
): ErrorDetail {
    const allTypes = flattenTree(symbols.typeTree).map(stringifyTypeReadable);
    const similarTypes = findSimilarStrings(relatedType.repr, allTypes);
    return {
        code: "0023",
        name: "ErrorUsingUndefinedType",
        message:
`The type ${relatedType.repr} does not exist.
${showSuggestion(similarTypes)}`,
        relatedLocation: relatedType.location
    };
}
