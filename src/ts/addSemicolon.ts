export function addSemicolon(input: string): string {
    return input.split("\n").map((x) => {
        const str = x.trim();
        return str[0] === "."   ? x :
               str.length === 0 ? x :
               ";" + x;
    }).join("\n");
}
