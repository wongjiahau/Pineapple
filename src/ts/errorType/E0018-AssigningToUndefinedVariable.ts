import { Variable } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorAssigningToUndefinedVariable(
    v: Variable
): ErrorDetail {
    return {
        code: "0018",
        name: "ErrorAssigningToUndefinedVariable",
        message:
`You cannot assign value to the variable \`${v.repr}\` as it does not exist.

Maybe you forgot to declare it?
`,
        relatedLocation: v.location,
        hint:
`To declare a variable, use the \`let\` keyword. For example:

    let ${v.repr} = 999
`
    };
}
