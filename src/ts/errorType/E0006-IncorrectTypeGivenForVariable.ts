import { Expression, VariableDeclaration } from "../ast";
import { ErrorDetail, stringifyTypeReadable } from "./errorUtil";

export function ErrorIncorrectTypeGivenForVariable(
    relatedVariable: VariableDeclaration,
    relatedExpression: Expression,
): ErrorDetail {
    return {
        code: "0006",
        name: "ErrorIncorrectTypeGivenForVariable",
        message:
`

The variable \`${relatedVariable.variable.repr}\` should have the type of:

    ${stringifyTypeReadable(relatedVariable.typeExpected)}

But the expression you provided have the type of:

    ${stringifyTypeReadable(relatedExpression.returnType)}
    `,
        relatedLocation: relatedExpression.location
    };
}
