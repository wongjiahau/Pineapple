import { expect } from "chai";
import { pine2js } from "../../../../pine2js";

describe("@func-call-infix-FCI-001", () => {
    it("infix function call", () => {
        const input =
`
def main:
    let x Number = 4
    let y Number = 6
    let result = x + y
`;
        const expectedOutput =
`
function _main(){
const $x = (4);
const $y = (6);
const $result = ($x._$plus_Number($y));
}
`.trim();

        const result = pine2js(input).trim();
        // console.log(expectedOutput);
        // console.log(result);
        expect(result).to.eq(expectedOutput);
    });

});
