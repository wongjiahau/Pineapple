import { ErrorDetail } from "./errorType/ErrorDetail";
import { isFail, Maybe, ok } from "./maybeMonad";
import { SourceCode } from "./interpret";
import { labelIndentation } from "./labelIndentation";
import { labelNewlines } from "./labelNewlines";
import { smoothify } from "./smoothify";

export function preprocess(input: SourceCode): Maybe<string, ErrorDetail> {
    let result = input.content + "\n";
    result = removeComments(result);
    result = labelNewlines(result);
    result = smoothify(result);
    const labelResult = labelIndentation(result, input);
    if (isFail(labelResult)) { return labelResult; }

    result = labelResult.value;
    result += "@EOF";
    return ok(result);
}

function removeComments(input: string): string {
    const lines = input.split("\n");
    return lines.map((x) => x.replace(/\/\/.*/g, "")).join("\n");
}
