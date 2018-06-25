import { labelIndentation } from "./labelIndentation";
import { labelNewlines } from "./labelNewlines";

export function preprocess(input: string): string {
    let result = labelNewlines(input);
    result = labelIndentation(result);
    // const smoothifized = smoothify(result);
    return result;
}
