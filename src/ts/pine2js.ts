import { Token, tokenize } from "./tokenize";
import { tpDeclaration } from "./transpile";

export function pine2js(input: string): string {
    const parser     = require("../jison/pineapple-parser-v2");
    const tokenized  = tokenize(input);
    const ast        = parser.parse(tokenized);
    // console.log(JSON.stringify(ast, null, 2));
    const symbolized = retrieveSymbol(Token.TokenTable, ast);
    // console.log(Token.TokenTable);
    // console.log(JSON.stringify(symbolized, null, 2));
    const code       = tpDeclaration(symbolized);
    // console.log(code);
    return code;
}

export function retrieveSymbol(tokenTable: {[key: number]: Token}, ast: any): any {
    for (const key in ast) {
        if (ast.hasOwnProperty(key)) {
            if (typeof ast[key] === "object") {
                ast[key] = retrieveSymbol(tokenTable, ast[key]);
            } else if (key === "tokenId") {
                const tokenId = parseInt(ast[key], 10);
                ast.token = [tokenTable[tokenId]].map((x) => ({
                    id: tokenId,
                    line: x.line,
                    column: x.column,
                    value: x.value
                }))[0];
                delete ast.tokenId;
            }
        }
    }
    return ast;
}
