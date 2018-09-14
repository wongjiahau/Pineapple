import { AtomicToken, StructDeclaration } from "../ast";
import { findSimilarStrings } from "../util";
import { showSuggestion } from "./errorUtil";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorAccessingInexistentMember(
    relatedStruct: StructDeclaration,
    inexistentKey: AtomicToken
): ErrorDetail {
    const members = relatedStruct.members;
    const similarKeys = findSimilarStrings(inexistentKey.repr, members.map((x) => x.name.repr));

    return {
        code: "0001",
        name: "ErrorAccessingInexistentMember",
        relatedLocation: inexistentKey.location,
        message:
`${relatedStruct.name.repr} does not have the member ${inexistentKey.repr}
${showSuggestion(similarKeys)}`,
    };
}
