import { AtomicToken, StructDeclaration } from "../ast";
import { StructTable } from "../fillUpTypeInformation";
import { findSimilarStrings, values } from "../util";
import { ErrorDetail, showSuggestion } from "./errorUtil";

export function ErrorUsingUndefinedStruct(
    undefinedStruct: AtomicToken,
    structTab: StructTable
): ErrorDetail {
    const structs: StructDeclaration[] = values(structTab);
    const similarStructs = findSimilarStrings(undefinedStruct.repr, structs.map((x) => x.name.repr));
    return {
        code: "0012",
        name: "ErrorUsingUndefinedStruct",
        message:
`You cannot use ${undefinedStruct.repr} as it does not exist.
${showSuggestion(similarStructs)}`,
    relatedLocation: undefinedStruct.location
};
}
