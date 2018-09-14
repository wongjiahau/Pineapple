import chalk from "chalk";
import { Expression, FunctionCall, TypeExpression } from "../ast";
import { displayFuncSignature, stringifyTypeReadable } from "./errorUtil";
import { ErrorDetail } from "./ErrorDetail";

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

should have type of:

${expectedTypes.map((x) => "    " + stringifyTypeReadable(x)).join(" OR\n")}

But the expression given have type of:

    ${stringifyTypeReadable(relatedParam.returnType)}
`,
        // hint: `Maybe you are calling the wrong function?`
    };
}
