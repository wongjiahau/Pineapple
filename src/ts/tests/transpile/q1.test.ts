import { expect } from "chai";
import { tokenize } from "../../lexer";
import { transpileDeclaration } from "../../transpile";

describe("q1", () => {
    const input =
`iofunction
main >> Void
    let $myName:String << \`123\`
    print $myName
`;
    const expectedOutput =
`function main() {
    let $myName = "123";
    print($myName);
}
`;
    expect(pine(input)).to.eq(expectedOutput);
});

function pine(input: string): string {
    const parser    = require("../../../jison/pineappe-parser-v2");
    const tokenized = tokenize(input);
    const ast       = parser.parse(tokenized);
    console.log(JSON.stringify(ast, null, 2));
    const code      = transpileDeclaration(ast);
    return code;
}
