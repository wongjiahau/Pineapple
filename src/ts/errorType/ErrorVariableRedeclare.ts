import { StructDeclaration, Variable } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorVariableRedeclare(
    initialVariable: Variable,
    redeclaredVariable: Variable
): ErrorDetail {
    return {
        message:
            `You cannot redeclare \`${redeclaredVariable.repr}\`` +
            ` as it is already declared at line ${initialVariable.location.first_line}`,
        relatedLocation: redeclaredVariable.location
    };
}
