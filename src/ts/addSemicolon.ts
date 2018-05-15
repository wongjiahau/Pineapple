export function addSemicolon(input: string): string {
    const keywords = "if,elif,else".split(",");
    const cleansed =  input.split("\n").filter((x) => x.length > 0);
    const result: string[] = [];
    for (let i = 0; i < cleansed.length; i++) {
        if (keywords.some((x) => cleansed[i].indexOf(x) > -1)) {
            result.push(cleansed[i]);
            continue;
        }
        if (i + 1 < cleansed.length) {
            if (cleansed[i + 1].trim()[0] !== ".") {
                result.push(cleansed[i] + ";");
            } else {
                result.push(cleansed[i]);
            }
            continue;
        }
        result.push(cleansed[i] + ";");
    }

    return result.join("\n").replace(/;+$/, "").replace(/^;+/, "");
}
