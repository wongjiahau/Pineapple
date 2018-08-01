import {AtomicToken, FunctionCall, Variable} from "../ast";
import {ErrorDetail} from "./errorUtil";

export function ErrorUsingUnknownFunction(relatedFunction: FunctionCall): ErrorDetail {
    return {
        // tslint:disable-next-line:max-line-length
        message: `You cannot call the function \`${(displayFuncSignature(relatedFunction.signature))}\` as it does not exist`,
        relatedLocation: relatedFunction.location
    };
}

function displayFuncSignature(xs: AtomicToken[]): string {
    return xs.map((x) => x.repr).join(" ");
}
