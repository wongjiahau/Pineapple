import { StructDeclaration } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorNoStructRedeclare(structDecl: StructDeclaration): ErrorDetail {
    const location = structDecl.name.location;
    if (location !== null) {
        return {
            message: `${structDecl.name.repr} is already defined`,
            relatedLocation: location
        };
    } else {
        throw new Error("Token location of struct should not be null");
    }
}
