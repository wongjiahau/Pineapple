import chalk from "chalk";
import { Expression, FunctionCall, TypeExpression } from "../ast";
import { displayFuncSignature, ErrorDetail, stringifyTypeReadable } from "./errorUtil";

export function ErrorNoConformingFunction(
    relatedFunction: FunctionCall,
    relatedArgumentPosition: number,
    relatedParam: Expression,
    expectedTypes: TypeExpression[],
): ErrorDetail {
    const sig = chalk.bold(displayFuncSignature(relatedFunction.signature));
    const position: {[key: number]: string} = {
        0: "first",
        1: "second",
        2: "third",
        3: "fourth",
        4: "fifth"
    };
    return {
        code: "0008",
        name: "ErrorNoConformingFunction",
        // tslint:disable-next-line:max-line-length
        relatedLocation: relatedParam.location,
        message:
`

The ${position[relatedArgumentPosition]} parameter of the function:

    ${sig}

should be one of the following type:

${expectedTypes.map((x) => "    " + stringifyTypeReadable(x)).join("\n")}

But you passed in

    ${stringifyTypeReadable(relatedParam.returnType)}
`,
    };
}
