export function addBrackets(input: string): string {
    const lines = input.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const currentIndentationLevel = indentationLevel(lines[i]);
        const nextIndentationLevel = i < lines.length - 1 ? indentationLevel(lines[i + 1]) : 0;
        if (currentIndentationLevel < nextIndentationLevel) {
            lines[i] += "{";
        } else if (currentIndentationLevel > nextIndentationLevel) {
            for (let j = 0; j < currentIndentationLevel - nextIndentationLevel; j++) {
                lines[i] += "}";
            }
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
