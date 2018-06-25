import { labelIndentation } from "./labelIndentation";
import { labelNewlines } from "./labelNewlines";
import { smoothify } from "./smoothify";

export function preprocess(input: string): string {
    let result = labelNewlines(input);
    result = labelIndentation(result);
    result += "@EOF";
    result = smoothify(result);
    return result;
}
