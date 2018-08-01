import levenshtein from "fast-levenshtein";

import { AtomicToken, MemberDefinition, StructDeclaration } from "../ast";
import { flattenLinkedNode } from "../getIntermediateForm";
import { ErrorDetail } from "./errorUtil";

export function ErrorAccessingInexistentMember(
    relatedStruct: StructDeclaration,
    inexistentKey: AtomicToken
): ErrorDetail {
    const keys = flattenLinkedNode(relatedStruct.members);
    const similarKeys = findSimilarKeys(inexistentKey, keys);

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

function findSimilarKeys(matcher: AtomicToken, availableKeys: MemberDefinition[]): string[] {
    const result: string[] = [];
    const acceptedDistance = matcher.repr.length / 2;
    for (let i = 0; i < availableKeys.length; i++) {
        if (levenshtein.get(matcher.repr, availableKeys[i].name.repr) <= acceptedDistance) {
            result.push(availableKeys[i].name.repr);
        }
    }
    return result;
}
