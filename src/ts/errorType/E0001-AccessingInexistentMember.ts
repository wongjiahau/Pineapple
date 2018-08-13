import { AtomicToken, StructDeclaration } from "../ast";
import { flattenLinkedNode } from "../getIntermediateForm";
import { findSimilarStrings } from "../util";
import { ErrorDetail, showSuggestion } from "./errorUtil";

export function ErrorAccessingInexistentMember(
    relatedStruct: StructDeclaration,
    inexistentKey: AtomicToken
): ErrorDetail {
    const keys = flattenLinkedNode(relatedStruct.members);
    const similarKeys = findSimilarStrings(inexistentKey.repr, keys.map((x) => x.name.repr));

    return {
        code: "0001",
        name: "ErrorAccessingInexistentMember",
        relatedLocation: inexistentKey.location,
        message:
`${relatedStruct.name.repr} does not have the member ${inexistentKey.repr}
${showSuggestion(similarKeys)}`,
    };
}
