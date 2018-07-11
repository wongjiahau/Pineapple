import { labelIndentation } from "./labelIndentation";
import { labelNewlines } from "./labelNewlines";
import { smoothify } from "./smoothify";

export function preprocess(input: string): string {
    let result = input.replace(/(\r\n|\r|\n)+/g, "\n");
    result += "\n";
    result = labelNewlines(result);
    result = smoothify(result);
    result = labelIndentation(result);
    // result = result.replace(/@DEDENT@DEDENT/g, "@DEDENT@NEWLINE@DEDENT");
    result += "@EOF";
    // console.log(labelLineNumbers(result));
    return result;
}
