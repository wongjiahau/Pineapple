export function addSemicolon(input: string): string {
    const result =  input.split("\n")
        .filter((x) => x.length > 0)
        .map((x) => {
            const str = x.trim();
            return str[0] === "."   ? x :
                str.length === 0 ? x :
                ";" + x;
        }).join("\n");
    if (result[0] === ";") {
        return result.slice(1);
    }
    return result;
}
