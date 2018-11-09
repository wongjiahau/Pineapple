import { EnumDecl } from "../ast";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorEnumRedeclare(
    e: EnumDecl,
    originFile: string
): ErrorDetail {
    return {
        code: "0015",
        name: "ErrorEnumRedeclare",
        message: `The enum ${e.name.repr} is already declared at ${originFile}`,
        relatedLocation: e.location
    };
}
