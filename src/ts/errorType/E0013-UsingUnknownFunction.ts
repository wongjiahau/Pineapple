import {FunctionCall} from "../ast";
import {displayFuncSignature} from "./errorUtil";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorUsingUnknownFunction(relatedFunction: FunctionCall): ErrorDetail {
    const funcname = displayFuncSignature(relatedFunction.signature);
    return {
        code: "0013",
        name: "ErrorUsingUnknownFunction",
        message: `You cannot call the function \`${(funcname)}\` as it does not exist`,
        relatedLocation: relatedFunction.signature[0].location
    };
}
