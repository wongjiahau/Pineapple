import { TokenLocation } from "../ast";
import { SourceCode } from "../interpret";
export interface ErrorDetail {
    code: string;
    name: string;
    message: string;
    relatedLocation: TokenLocation;
    hint?: string;
    source?: SourceCode;
}