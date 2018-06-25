import { labelIndentation } from "./labelIndentation";
import { labelNewlines } from "./labelNewlines";
import { smoothify } from "./smoothify";

export function preprocess(input: string): string {
    let result = labelNewlines(input.trim());
    result = labelIndentation(result);
    result += "@EOF";
    result = smoothify(result);
    // console.log(result);
    return result;
}
