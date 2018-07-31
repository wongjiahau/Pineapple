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
    ERROR >>| 2 |     print: "Hello world"
            | 3 |     print: "Bye"
`.trim();
        // console.error(result);
        expect(result.trim()).to.eq(expected);
    });

    it("case 2", () => {
        const input =
`
    print: "1"
    print: "2"
    print: "3"
    print: "4"
    print: "5"
    print: "6"
    print: "7"
    print: "8"
    print: "9"
    print: "10"
    print: "11"
    print: "12"
    print: "13"
    print: "14"
`.trim();
        const result = labelLineNumbers(input, 10);
        const expected =
`
            |  6 |     print: "6"
            |  7 |     print: "7"
            |  8 |     print: "8"
            |  9 |     print: "9"
    ERROR >>| 10 |     print: "10"
            | 11 |     print: "11"
            | 12 |     print: "12"
            | 13 |     print: "13"
            | 14 |     print: "14"
`.trim();
        // console.log(result);
        expect(result.trim()).to.eq(expected);
    });

});
