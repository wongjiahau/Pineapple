import { Expression, VariableDeclaration, Variable, TypeExpression } from "../ast";
import { ErrorDetail, stringifyTypeReadable } from "./errorUtil";

export function ErrorIncorrectTypeGivenForVariable(
    relatedVariable: Variable,
    expectedType: TypeExpression,
    relatedExpression: Expression,
): ErrorDetail {
    return {
        code: "0006",
        name: "ErrorIncorrectTypeGivenForVariable",
        message:
`

The variable \`${relatedVariable.repr}\` should have the type of:

    ${stringifyTypeReadable(expectedType)}

But the expression you provided have the type of:

    ${stringifyTypeReadable(relatedExpression.returnType)}
    `,
        relatedLocation: relatedExpression.location
    };
}
