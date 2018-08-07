import { StructDeclaration } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorNoStructRedeclare(structDecl: StructDeclaration): ErrorDetail {
    return {
        code: "0009",
        name: "ErrorNoStructRedeclare",
        message: `${structDecl.name.repr} is already defined`,
        relatedLocation: structDecl.name.location
    };
}
