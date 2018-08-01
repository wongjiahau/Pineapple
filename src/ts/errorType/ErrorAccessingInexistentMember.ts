import levenshtein from "fast-levenshtein";

import { AtomicToken, StructDeclaration } from "../ast";
import { flattenLinkedNode } from "../getIntermediateForm";
import { ErrorDetail } from "./errorUtil";

export function ErrorAccessingInexistentMember(
    relatedStruct: StructDeclaration,
    inexistentKey: AtomicToken
): ErrorDetail {
    const keys = flattenLinkedNode(relatedStruct.members);
    const similarKeys: string[] = [];
    const acceptedDistance = inexistentKey.repr.length / 2;
    for (let i = 0; i < keys.length; i++) {
        if (levenshtein.get(inexistentKey.repr, keys[i].name.repr) <= acceptedDistance) {
            similarKeys.push(keys[i].name.repr);
        }
    }
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
