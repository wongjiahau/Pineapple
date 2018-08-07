import {  KeyValue, TypeExpression } from "../ast";
import { stringifyType } from "../transpile";
import { ErrorDetail } from "./errorUtil";

export function ErrorIncorrectTypeGivenForMember(
    expectedType: TypeExpression,
    relatedKeyValue: KeyValue
): ErrorDetail {
    return {
        code: "0005",
        name: "ErrorIncorrectTypeGivenForMember",
        // tslint:disable-next-line:max-line-length
        message: `The type of ${relatedKeyValue.memberName.repr} should be ${stringifyType(expectedType)} but you gave it a ${stringifyType(relatedKeyValue.expression.returnType)}`,
        relatedLocation: relatedKeyValue.memberName.location
    };
}
