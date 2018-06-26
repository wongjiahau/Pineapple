/**
 * This function is to smoothify the input so that it will be easier parse
 * @param input
 */
export function smoothify(input: string): string {
    let result = "";
    const lines = input.split("\n");
    let currentIndentation = "";
    for (let i = 0; i < lines.length; i++) {
        if (/^\s*@NEWLINE\s*$/.test(lines[i])) {
            result += currentIndentation + "\n";
        } else {
            currentIndentation = lines[i].match(/^\s*/g)[0];
            result += lines[i] + "\n";
        }
    }
    return result;
}
