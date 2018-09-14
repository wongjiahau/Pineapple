import { labelIndentation } from "./labelIndentation";
import { labelNewlines } from "./labelNewlines";
import { smoothify } from "./smoothify";
import { SourceCode } from "./interpret";
import { isFail, Maybe, ok } from "./fillUpTypeInformation";
import { ErrorDetail } from "./errorType/errorUtil";

export function preprocess(input: SourceCode): Maybe<string, ErrorDetail> {
    let result = input.content + "\n";
    result = removeComments(result);
    result = labelNewlines(result);
    result = smoothify(result);
    const labelResult = labelIndentation(result, input);
    if(isFail(labelResult)) return labelResult;

    result = labelResult.value;
    result += "@EOF";
    return ok(result);
}

function removeComments(input: string): string {
    const lines = input.split("\n");
    return lines.map((x) => x.replace(/\/\/.*/g, "")).join("\n");
}
