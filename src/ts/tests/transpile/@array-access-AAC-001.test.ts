import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@array-access-AAC-001", () => {
    it("case 1", () => {
        const input =
`
def main:
    let x = [1 2 3]
    print: x[0]
`;
        const expectedOutput =
`
`.trim();

        const result = pine2js(input).trim();
        // console.log(expectedOutput);
        console.log(result);
        expect(result).to.eq(expectedOutput);
    });

});
