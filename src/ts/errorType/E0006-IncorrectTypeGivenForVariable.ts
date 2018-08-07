import {  TypeExpression, VariableDeclaration } from "../ast";
import { stringifyType } from "../transpile";
import { ErrorDetail } from "./errorUtil";

export function ErrorIncorrectTypeGivenForVariable(
    relatedVariable: VariableDeclaration,
    actualType: TypeExpression
): ErrorDetail {
    return {
        code: "0006",
        name: "ErrorIncorrectTypeGivenForVariable",
        message:
        `Variable \`${relatedVariable.variable.repr}\` wanted ` +
        `${stringifyType(relatedVariable.typeExpected)} type but you gave it ${stringifyType(actualType)} input`,
        relatedLocation: relatedVariable.variable.location
    };
}
