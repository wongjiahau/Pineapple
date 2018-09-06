import { StringExpression, TokenLocation } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorMissingClosingBracket(
    s: StringExpression,
    numberOfClosingBracketsRequired: number,
    location: TokenLocation | null = null
): ErrorDetail {
    if (location === null) {
        location = s.location;
        location.first_column = location.last_column - 1;
    }
    return {
        code: "0027",
        name: "ErrorMissingClosingBracket",
        message: `Should have ${numberOfClosingBracketsRequired} more closing bracket \`(\` here.`,
        relatedLocation: location
    };
}
