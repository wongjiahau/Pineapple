import { ThingDecl, TokenLocation } from "../ast";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorMissingMember(
    missingKey: string,
    relatedStruct: ThingDecl,
    relatedLocation: TokenLocation
): ErrorDetail {
    relatedLocation = {
        ...relatedLocation,
        first_line: relatedLocation.first_line - 1
    };
    return {
        code: "0007",
        name: "ErrorMissingMember",
        message: `Missing member ${missingKey} for ${relatedStruct.name}`,
        relatedLocation: relatedLocation,
    };
}
