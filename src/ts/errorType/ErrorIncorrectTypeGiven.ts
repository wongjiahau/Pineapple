import { TypeExpression, VariableDeclaration } from "../ast";
import { stringifyType } from "../transpile";
import { ErrorDetail } from "./errorUtil";

export function ErrorIncorrectTypeGiven(
    relatedVariable: VariableDeclaration,
    actualType: TypeExpression
): ErrorDetail {
    return {
        message:
        `Variable \`${relatedVariable.variable.repr}\` wanted ` +
        `${stringifyType(relatedVariable.typeExpected)} type but you gave it ${stringifyType(actualType)} input`,
        relatedLocation: relatedVariable.variable.location
    };
}
