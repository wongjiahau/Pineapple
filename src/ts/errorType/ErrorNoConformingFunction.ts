import { FunctionCall, FunctionDeclaration } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorNoConformingFunction(
    relatedFunction: FunctionCall,
    similarFunctions: FunctionDeclaration[]
): ErrorDetail {
    return {
        name: "ErrorNoConformingFunction",
        message: "",
        relatedLocation: relatedFunction.location
    };
}
