import { expect } from "chai";
import { pine2js } from "../../../../pine2js";

describe("@literal-number-LNU-001", () => {
    it("every number should be surrounded by brackets", () => {
        const input =
`
def main:
    print: 12345
`
;
        const expectedOutput =
`
function _main(){
(12345)._print();
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
