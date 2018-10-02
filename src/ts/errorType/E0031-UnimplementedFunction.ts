import { FunctionDeclaration, TypeExpression } from "../ast";
import { ErrorDetail } from "./ErrorDetail";
import { getPartialFunctionName } from "../transpile";
import { stringifyTypeReadable } from "./errorUtil";

export function ErrorUnimplementedFunction(
    requiredFunction: FunctionDeclaration,
    relatedType: TypeExpression
): ErrorDetail {
    return {
        code: "0031",
        name: "ErrorUnimplementedFunction",
        message: `${getPartialFunctionName(requiredFunction)} is not implemented by ${stringifyTypeReadable(relatedType)}`,
        relatedLocation: relatedType.location
    };
}