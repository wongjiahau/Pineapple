import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("@array-access-AAC-003", () => {
    it("type inference on array element", () => {
        const input =
`
def main:
    let x = [1,2][0] + [2,3][0]
`;
        const expectedOutput =
`
function _main(){
const $x = ((new ArrayOfNumber([(1),(2),]))[(0)]._$plus_Number((new ArrayOfNumber([(2),(3),]))[(0)]));
}
`.trim();

        const result = pine2js(input).trim();
        // console.log(expectedOutput);
        // console.log(result);
        expect(result).to.eq(expectedOutput);
    });

});
