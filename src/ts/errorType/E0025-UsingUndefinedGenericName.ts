import { AtomicToken } from "../ast";
import { ErrorDetail, showSuggestion } from "./errorUtil";

export function ErrorUsingUndefinedGenericName(
    relatedGenericName: AtomicToken,
    supposedGenericNames: string[]
): ErrorDetail {
    return {
        code: "0025",
        name: "ErrorUsingUndefinedGenericName",
        message:
`The generic name ${relatedGenericName.repr} does not exist in the current scope.
${showSuggestion(supposedGenericNames)}`,
        relatedLocation: relatedGenericName.location
    };
}
