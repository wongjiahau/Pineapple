import { AtomicToken, ThingDecl } from "../ast";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorExtraMember(
    extraMember: AtomicToken,
    relatedStruct: ThingDecl
): ErrorDetail {
    return {
        code: "0004",
        name: "ErrorExtraMember",
        message: `${relatedStruct.name} should not have the member ${extraMember.repr}`,
        relatedLocation: extraMember.location
    };
}
