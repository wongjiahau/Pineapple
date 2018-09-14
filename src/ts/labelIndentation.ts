import {ErrorInvalidIndentation} from "./errorType/E0029-InvalidIndentation";
import { ErrorDetail } from "./errorType/errorUtil";
import {fail, isFail, Maybe, ok} from "./fillUpTypeInformation";
import { SourceCode } from "./interpret";

export function labelIndentation(input: string, sourceCode: SourceCode)
: Maybe<string, ErrorDetail> {
    const lines = input.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const result = indentationLevel(lines[i], i, sourceCode);
        if (isFail(result)) { return result; }

        const currentIndentationLevel = result.value;

        let temp: Maybe<number, ErrorDetail>;
        if (i < lines.length - 1) {
            temp = indentationLevel(lines[i + 1], i + 1, sourceCode);
            if (isFail(temp)) { return temp; }
        } else {
            temp = ok(0);
        }

        const nextIndentationLevel = temp.value;

        if (currentIndentationLevel < nextIndentationLevel) {
            lines[i] += "@INDENT";
        } else if (currentIndentationLevel > nextIndentationLevel) {
            for (let j = 0; j < currentIndentationLevel - nextIndentationLevel; j++) {
                lines[i] += "@DEDENT";
            }
        }
    }
    return ok(lines.join("\n"));
}

function indentationLevel(line: string, lineNumber: number, sourceCode: SourceCode)
: Maybe<number, ErrorDetail> {
    line = line.replace(/\t/g, "    "); // replace tabs with 4 spaces
    const numberOfLeadingSpaces = line.search(/\S|$/);
    if (numberOfLeadingSpaces % 4 !== 0) {
        const error = ErrorInvalidIndentation(lineNumber, numberOfLeadingSpaces);
        error.source = sourceCode;
        return fail(error);
    }
    return ok(numberOfLeadingSpaces / 4);
}
