import { Variable } from "../ast";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorVariableRedeclare(
    initialVariable: Variable,
    redeclaredVariable: Variable
): ErrorDetail {
    return {
        code: "0014",
        name: "ErrorVariableRedeclare",
        message:
            `You cannot redeclare \`${redeclaredVariable.repr}\`` +
            ` as it is already declared at line ${initialVariable.location.first_line}`,
        relatedLocation: redeclaredVariable.location
    };
}
