import { AtomicToken, ThingDecl } from "../ast";
import { findSimilarStrings } from "../util";
import { showSuggestion } from "./errorUtil";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorAccessingInexistentMember(
    relatedStruct: ThingDecl,
    inexistentKey: AtomicToken
): ErrorDetail {
    const members = relatedStruct.members;
    const similarKeys = findSimilarStrings(inexistentKey.repr, members.map((x) => x.name.repr));

    return {
        code: "0001",
        name: "ErrorAccessingInexistentMember",
        relatedLocation: inexistentKey.location,
        message:
`${relatedStruct.name} does not have the member ${inexistentKey.repr}
${showSuggestion(similarKeys)}`,
    };
}
