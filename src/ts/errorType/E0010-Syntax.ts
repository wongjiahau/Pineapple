import { TokenLocation } from "../ast";
import { ErrorDetail } from "./ErrorDetail";

export interface ParserErrorDetail {
    text: string;
    token: string;
    line: number;
    loc: TokenLocation;
    expected: string[];
}

export function ErrorSyntax(errorHash: ParserErrorDetail): ErrorDetail {
    return {
        code: "0010",
        name: "ErrorSyntax",
        message: `${errorHash.token} \`${errorHash.text}\` shouldn't appear after the marked text.`,
        relatedLocation: errorHash.loc
    };
}
