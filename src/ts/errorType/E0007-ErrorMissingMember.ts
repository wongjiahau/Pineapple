import { StructDeclaration, TokenLocation } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorMissingMember(
    missingKey: string,
    relatedStruct: StructDeclaration,
    relatedLocation: TokenLocation
): ErrorDetail {
    relatedLocation = {
        ...relatedLocation,
        first_line: relatedLocation.first_line - 1
    };
    return {
        code: "0007",
        name: "ErrorMissingMember",
        message: `Missing member ${missingKey} for ${relatedStruct.name.repr}`,
        relatedLocation: relatedLocation,
    };
}
