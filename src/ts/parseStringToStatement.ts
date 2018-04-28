import { IStatement, newStatement } from "./groupStatements";

export function parseStatement(input: string): IStatement {
    const fourSpaces = "    ";
    const line = input.replace("\t", fourSpaces);
    let leadingSpacesCount = 0;
    for (let i = 0; i < line.length; i++) {
        if (line[i] !== " ") {
            break;
        }
        leadingSpacesCount++;
    }
    if (leadingSpacesCount % 4 !== 0) {
        throw new Error("Leading space count of a statement must be in multiplier of 4.");
    }
    return newStatement(leadingSpacesCount / 4, line.trimLeft());
}
