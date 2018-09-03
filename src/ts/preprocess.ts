import { labelIndentation } from "./labelIndentation";
import { labelNewlines } from "./labelNewlines";
import { smoothify } from "./smoothify";

export function preprocess(input: string): string {
    let result = input + "\n";
    result = labelNewlines(result);
    result = smoothify(result);
    result = labelIndentation(result);
    // console.log(labelLineNumbers(result, 0));
    // console.log(result);
    result += "@EOF";
    return result;
}
