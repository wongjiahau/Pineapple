import { expect } from "chai";
import { pine2js } from "../../../../pine2js";

describe("LAR-003", () => {
    it("empty array", () => {
        const input =
`
def main:
    let x String[] = []
    let y Number[] = []
`;
        const expectedOutput =
`
function _main(){
const $x = (new ArrayOfString([]));
const $y = (new ArrayOfNumber([]));
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
/*

// Some idea
class ArrayOfString extends Array {
    constructor(xs) {
        super(...xs);
    }
}

let xs = new ArrayOfString([1,2,3])

*/
