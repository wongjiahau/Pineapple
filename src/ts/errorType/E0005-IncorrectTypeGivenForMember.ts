import {  KeyValue, TypeExpression } from "../ast";
import { ErrorDetail, stringifyTypeReadable } from "./errorUtil";

export function ErrorIncorrectTypeGivenForMember(
    expectedType: TypeExpression,
    relatedKeyValue: KeyValue
): ErrorDetail {
    return {
        code: "0005",
        name: "ErrorIncorrectTypeGivenForMember",
        // tslint:disable-next-line:max-line-length
        message:
`The expected type of ${relatedKeyValue.memberName.repr} is:

    ${stringifyTypeReadable(expectedType)}

But the given expression has type of:

    ${stringifyTypeReadable(relatedKeyValue.expression.returnType)}`,
        relatedLocation: relatedKeyValue.memberName.location
    };
}
