import { AtomicToken } from "../ast";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorDuplicatedMember(
    repeatedMember: AtomicToken,
    initialMember: AtomicToken
): ErrorDetail {
    return {
        code: "0003",
        name: "ErrorDuplicatedMember",
        message: `${repeatedMember.repr} is already declared on line ${initialMember.location.first_line}`,
        relatedLocation: repeatedMember.location
    };
}
