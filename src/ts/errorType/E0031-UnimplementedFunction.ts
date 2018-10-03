import { FunctionDeclaration, TypeExpression, GroupDeclaration } from "../ast";
import { ErrorDetail } from "./ErrorDetail";
import { getPartialFunctionName } from "../transpile";
import { stringifyTypeReadable } from "./errorUtil";

export function ErrorUnimplementedFunction(
    requiredFunction: FunctionDeclaration,
    relatedType: TypeExpression,
    mandatingGroup: GroupDeclaration
): ErrorDetail {
    return {
        code: "0031",
        name: "ErrorUnimplementedFunction",
        message: 
`The function below (which is required by the group ${mandatingGroup.name.repr}):

    ${getPartialFunctionName(requiredFunction)} 

is not yet implemented by ${stringifyTypeReadable(relatedType)}.`,
        relatedLocation: relatedType.location
    };
}