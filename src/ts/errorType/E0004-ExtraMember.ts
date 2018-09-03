import { AtomicToken, StructDeclaration } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorExtraMember(
    extraMember: AtomicToken,
    relatedStruct: StructDeclaration
): ErrorDetail {
    return {
        code: "0004",
        name: "ErrorExtraMember",
        message: `${relatedStruct.name.repr} should not have the member ${extraMember.repr}`,
        relatedLocation: extraMember.location
    };
}
