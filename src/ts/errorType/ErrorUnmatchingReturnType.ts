import { ReturnStatement, TokenLocation, TypeExpression } from "../ast";
import { stringifyTypeReadable } from "./ErrorNoConformingFunction";
import { ErrorDetail } from "./errorUtil";

export function ErrorUnmatchingReturnType(
    relatedReturnStatement: ReturnStatement,
    expectedReturnType: TypeExpression
): ErrorDetail {
    return {
        name: "ErrorUnmatchingReturnType",
        message:
`The return type should be ${stringifyTypeReadable(expectedReturnType)}, ` +
`not ${stringifyTypeReadable(relatedReturnStatement.expression.returnType)}`,
        relatedLocation: relatedReturnStatement.location
    };
}
