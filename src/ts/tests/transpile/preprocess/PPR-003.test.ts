import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("@preprocess-PP-003.test.ts", () => {
    it("should ignore dangling newlines", () => {
        const input =
`
def main:
    let y = 6


    let x = 8
`;
        const expectedOutput =
`
function _main(){
const $y = (6);
const $x = (8);
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});