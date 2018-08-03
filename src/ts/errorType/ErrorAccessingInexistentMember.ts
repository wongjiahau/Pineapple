import { AtomicToken, StructDeclaration } from "../ast";
import { flattenLinkedNode } from "../getIntermediateForm";
import { findSimilarStrings } from "../util";
import { ErrorDetail } from "./errorUtil";

export function ErrorAccessingInexistentMember(
    relatedStruct: StructDeclaration,
    inexistentKey: AtomicToken
): ErrorDetail {
    const keys = flattenLinkedNode(relatedStruct.members);
    const similarKeys = findSimilarStrings(inexistentKey.repr, keys.map((x) => x.name.repr));

    return {
        name: "ErrorAccessingInexistentMember",
        message:
`${relatedStruct.name.repr} does not have the member ${inexistentKey.repr}

Do you mean one of the following ?

${similarKeys.map((x) => "  " + x).join("\n")}
`,
        relatedLocation: inexistentKey.location
    };
}
