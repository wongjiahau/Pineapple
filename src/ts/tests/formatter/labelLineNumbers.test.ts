import { expect } from "chai";
import { labelLineNumbers } from "../../labelLineNumbers";

describe("label line numbers", () => {
    it("case 1", () => {
        const input =
`
def .main
    print: "Hello world"
    print: "Bye"
`.trim();
        const result = labelLineNumbers(input, 2);
        const expected =
`
          | 1 | def .main
ERROR >>> | 2 |     print: "Hello world"
          | 3 |     print: "Bye"
`.trim();
        // console.error(result);
        expect(result.trim()).to.eq(expected);
    });

});
