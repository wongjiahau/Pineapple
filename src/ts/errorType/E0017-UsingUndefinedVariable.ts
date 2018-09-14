import { Variable } from "../ast";
import { VariableTable } from "../fillUpTypeInformation";
import { findSimilarStrings, values } from "../util";
import { showSuggestion } from "./errorUtil";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorUsingUndefinedVariable(
    v: Variable,
    vartab: VariableTable
): ErrorDetail {
    const variables = values(vartab).map((x) => x.repr);
    const similarVariables = findSimilarStrings(v.repr, variables);
    return {
        code: "0017",
        name: "ErrorUsingUndefinedVariable",
        message:
`You cannot use the variable \`${v.repr}\` as it does not exist.
${showSuggestion(similarVariables)}`.trim(),
        relatedLocation: v.location,
        hint:
`To use a variable, you need to declare it first using the \`let\` keyword.

For example:

        let ${v.repr} = 999`
    };
}
