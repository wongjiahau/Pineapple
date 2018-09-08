import { ErrorDetail } from "./errorUtil";

export function ErrorInvalidIndentation(
    lineNumber: number,
    numberOfLeadingSpaces: number,
): ErrorDetail {
    return {
        name: "ErrorInvalidIndentation",
        code: "0029",
        message: 
`Number of leading spaces of each line should be divisible by 4.

But the number of spaces at the pointed line is ${numberOfLeadingSpaces}, which is not divisible by 4.`,
        relatedLocation: {
            first_line: lineNumber + 1,
            last_line: lineNumber + 1,
            first_column: 0,
            last_column: numberOfLeadingSpaces
        },
        hint: "Maybe you can try adding/deleting some leading spaces?"
    };
}