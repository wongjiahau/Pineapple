import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@func-call-infix-FCI-002", () => {
    it("nested infix function call", () => {
        const input =
`
def main:
    let y = 6 + 6 + 6
`;
        const expectedOutput =
`
function _main(){
const $y = (((6)._$plus_Number((6)))._$plus_Number((6)));
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
