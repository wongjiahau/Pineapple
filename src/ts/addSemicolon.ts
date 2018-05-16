export function addSemicolon(input: string): string {
    const keywords = "if,elif,else".split(",");
    const cleansed =  input.split("\n").filter((x) => x.length > 0).filter((x) => !/^\s*$/.test(x));
    const result: string[] = [];
    for (let i = 0; i < cleansed.length; i++) {
        const currentLine = cleansed[i];
        if (keywords.some((x) => currentLine.indexOf(x) > -1)) {
            result.push(currentLine);
            continue;
        }
        if (i + 1 < cleansed.length) {
            const nextLine = cleansed[i + 1];
            if (nextLine.trim()[0] === "." || keywords.slice(1).some((x) => nextLine.indexOf(x) > -1)) {
                result.push(cleansed[i]);
            } else {
                result.push(cleansed[i] + ";");
            }
            continue;
        }
        result.push(cleansed[i] + ";");
    }

    return result.join("\n").replace(/;+$/, "").replace(/^;+/, "");
}
