import { SourceCode } from "./cli";
import { labelIndentation } from "./labelIndentation";
import { labelNewlines } from "./labelNewlines";
import { smoothify } from "./smoothify";

export function preprocess(input: SourceCode): string {
    let result = input.content + "\n";
    result = removeComments(result);
    result = labelNewlines(result);
    result = smoothify(result);
    result = labelIndentation(result, input);
    result += "@EOF";
    return result;
}

function removeComments(input: string): string {
    const lines = input.split("\n");
    return lines.map((x) => x.replace(/\/\/.*/g, "")).join("\n");
}
