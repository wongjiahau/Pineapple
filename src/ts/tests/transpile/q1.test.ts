import { expect } from "chai";
import { Token, tokenize } from "../../lexer";
import { tpDeclaration } from "../../transpile";

describe("q1", () => {
    it("q001", () => {
        const input =
`iofunction
main >> Void
    let $myName:String << \`123\`
    print $myName
`;
        const expectedOutput =
`
function main() {
let $myName = "123";
prefix_print($myName);
}

`;
        expect(pine(input)).to.eq(expectedOutput);
    });

});

function pine(input: string): string {
    const parser     = require("../../../jison/pineappe-parser-v2");
    const tokenized  = tokenize(input);
    const ast        = parser.parse(tokenized);
    const symbolized = retrieveSymbol(Token.TokenTable, ast);
    // console.log(Token.TokenTable);
    // console.log(JSON.stringify(symbolized, null, 2));
    const code       = tpDeclaration(symbolized);
    // console.log(code);
    return code;
}

function retrieveSymbol(tokenTable: {[key: number]: Token}, ast: any): any {
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
