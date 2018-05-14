export function addBrackets(input: string): string {
    const lines = input.split("\n");
    let numberOfClosingRequired = 0;
    for (let i = 0; i < lines.length; i++) {
        if (i === lines.length - 1) {
            if (numberOfClosingRequired > 0) {
                lines[i] += "}";
            }
            return "{" + lines.join("\n") + "}";
        }
        const currentIndentationLevel = indentationLevel(lines[i]);
        const nextIndentationLevel = indentationLevel(lines[i + 1]);
        if (currentIndentationLevel < nextIndentationLevel) {
            lines[i] += "{";
            numberOfClosingRequired++;
        } else if (currentIndentationLevel > nextIndentationLevel) {
            lines[i] += "}";
            numberOfClosingRequired--;
        }
    }
    return "{" + lines.join("\n") + "}";
}

function indentationLevel(line: string): number {
    const numberOfLeadingSpaces = line.search(/\S|$/);
    if (numberOfLeadingSpaces % 4 !== 0) {
        throw new Error("Number of leading spaces should be divisible by 4 at >>> " + line);
    }
    return numberOfLeadingSpaces / 4;
}
