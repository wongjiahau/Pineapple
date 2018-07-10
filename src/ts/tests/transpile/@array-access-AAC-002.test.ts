import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@array-access-AAC-002", () => {
    it("case 1", () => {
        const input =
`
def main:
    print: [1,2][0]
`;
        const expectedOutput =
`
function _main(){
(new ArrayOfNumber([(1),(2),]))[(0)]._print();
}
`.trim();

        const result = pine2js(input).trim();
        // console.log(expectedOutput);
        // console.log(result);
        expect(result).to.eq(expectedOutput);
    });

});
