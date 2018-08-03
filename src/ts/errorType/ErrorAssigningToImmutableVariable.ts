import chalk from "chalk";
import { Variable } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorAssigningToImmutableVariable(
    relatedVariable: Variable
): ErrorDetail {
    return {
        name: "ErrorAssigningToImmutableVariable",
        message: `You cannot assign value to variable ${chalk.bold.underline(relatedVariable.repr)}` +
        ` as it is immutable.`,
        hint:
`In Pineapple, every variable is immutable by default.
To make a variable mutable, you have to use the \`mutable\` keyword.

For example:

        let myVar mutable = 123`,
        relatedLocation: relatedVariable.location
    };
}
