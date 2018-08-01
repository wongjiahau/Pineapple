import {AtomicToken, FunctionCall, Variable} from "../ast";
import {ErrorDetail} from "./errorUtil";

export function ErrorUsingUnknownFunction(relatedFunction: FunctionCall): ErrorDetail {
    const funcname = displayFuncSignature(relatedFunction.signature);
    return {
        name: "ErrorUsingUnknownFunction",
        message: `You cannot call the function \`${(funcname)}\` as it does not exist`,
        relatedLocation: relatedFunction.location
    };
}

function displayFuncSignature(xs: AtomicToken[]): string {
    return xs.map((x) => x.repr).join(" ");
}
