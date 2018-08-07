import { StructDeclaration } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorStructRedeclare(structDecl: StructDeclaration): ErrorDetail {
    return {
        code: "0009",
        name: "ErrorStructRedeclare",
        message: `${structDecl.name.repr} is already defined`,
        relatedLocation: structDecl.name.location
    };
}
