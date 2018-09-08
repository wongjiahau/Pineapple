import {raise} from "./fillUpTypeInformation";
import {ErrorInvalidIndentation} from "./errorType/E0029-InvalidIndentation";
import {SourceCode} from "./cli";

export function labelIndentation(input : string, sourceCode : SourceCode) : string {
    const lines = input.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const currentIndentationLevel = indentationLevel(lines[i], i, sourceCode);

        const nextIndentationLevel = i < lines.length - 1
            ? indentationLevel(lines[i + 1], i + 1, sourceCode)
            : 0;
        if (currentIndentationLevel < nextIndentationLevel) {
            lines[i] += "@INDENT";
        } else if (currentIndentationLevel > nextIndentationLevel) {
            for (let j = 0; j < currentIndentationLevel - nextIndentationLevel; j++) {
                lines[i] += "@DEDENT";
            }
        }
    }
    return lines.join("\n");
}

function indentationLevel(line : string, lineNumber : number, sourceCode : SourceCode) : number {
    line = line.replace(/\t/g, "    "); // replace tabs with 4 spaces
    const numberOfLeadingSpaces = line.search(/\S|$/);
    if (numberOfLeadingSpaces % 4 !== 0) {
        const error = ErrorInvalidIndentation(lineNumber, numberOfLeadingSpaces);
        raise(error, sourceCode);
    }
    return numberOfLeadingSpaces / 4;
}
