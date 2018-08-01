import { AtomicToken } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorDuplicatedMember(
    repeatedMember: AtomicToken,
    initialMember: AtomicToken
): ErrorDetail {
    return {
        name: "ErrorDuplicatedMember",
        message: `${repeatedMember.repr} is already declared on line ${initialMember.location.first_line}`,
        relatedLocation: repeatedMember.location
    };
}
