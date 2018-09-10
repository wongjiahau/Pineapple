import { ReturnStatement, TypeExpression } from "../ast";
import { ErrorDetail, stringifyTypeReadable } from "./errorUtil";

export function ErrorUnmatchingReturnType(
    relatedReturnStatement: ReturnStatement,
    expectedReturnType: TypeExpression | null
): ErrorDetail {
    return {
        code: "0011",
        name: "ErrorUnmatchingReturnType",
        message:
`The return type should be ${stringifyTypeReadable(expectedReturnType)}, ` +
`not ${stringifyTypeReadable(relatedReturnStatement.expression.returnType)}`,
        relatedLocation: relatedReturnStatement.location
    };
}
