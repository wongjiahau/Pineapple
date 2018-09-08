import { labelIndentation } from "./labelIndentation";
import { labelNewlines } from "./labelNewlines";
import { smoothify } from "./smoothify";
import { SourceCode } from "./interpreter";

export function preprocess(input: SourceCode): string {
    let result = input.content + "\n";
    result = labelNewlines(result);
    result = smoothify(result);
    result = labelIndentation(result, input);
    result += "@EOF";
    return result;
}
