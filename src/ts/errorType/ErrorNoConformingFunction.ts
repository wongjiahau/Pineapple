import chalk from "chalk";
import { FunctionCall, FunctionDeclaration, TypeExpression } from "../ast";
import { stringifyType } from "../transpile";
import { displayFuncSignature } from "./ErrorUsingUnknownFunction";
import { ErrorDetail } from "./errorUtil";

export function ErrorNoConformingFunction(
    relatedFunction: FunctionCall,
    similarFunctions: FunctionDeclaration[]
): ErrorDetail {
    const sig = chalk.bold(displayFuncSignature(relatedFunction.signature));
    return {
        name: "ErrorNoConformingFunction",
        // tslint:disable-next-line:max-line-length
        message:
`The parameter(s) you passed in for ${sig} is incorrect.

The ${sig} function have the following signature(s):

${similarFunctions.map((x) => "    " + displayFullFuncSignature(x)).join("\n")}
`,
        relatedLocation: relatedFunction.location
    };
}

export function displayFullFuncSignature(f: FunctionDeclaration): string {
    let result = "";
    for (let i = 0; i < f.parameters.length; i++) {
        result += `(${stringifyTypeReadable((f.parameters[i].typeExpected))})`;
        if (f.signature[i] !== undefined) {
            result += f.signature[i].repr;
        }
    }
    result += ` -> ${stringifyTypeReadable(f.returnType)}`;
    return result;
}

export function stringifyTypeReadable(t: TypeExpression): string {
    return stringifyType(t); // TODO: Change the algorithm
}
