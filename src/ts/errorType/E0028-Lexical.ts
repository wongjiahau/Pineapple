import { TokenLocation } from "../ast";
import { ErrorDetail } from "./errorUtil";

export interface LexerErrorDetail {
    message: string;
    hash: {
        text: string;
        line: number;
        loc: TokenLocation;
    };
}

export function ErrorLexical(error: LexerErrorDetail): ErrorDetail {
    const loc = error.hash.loc;
    loc.first_column ++;
    loc.last_column ++;
    return {
        code: "0028",
        name: "ErrorLexical",
        message: "The text after the marking is not processible.",
        relatedLocation: loc
    };
}
