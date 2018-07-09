import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe.skip("@snippet-SNI-00001.test.ts", () => {
    it("case 1", () => {
        const input =
`
def (this Int) add: (that Int) -> Int
    return this + that

def (this Int[]) add: (that Int[]) -> Int[]
    let result Int[] mutable = []
    for i in 0..<that.length
        result = result append: (this[i] + that[i])
    return result

def main:
    let y = 8 add: 9
    let xs = [1 2 3] add: [4 5 6]
`;
        const expectedOutput =
`
function _main(){
const $y = (6);
const $x = (8);
}
`;
        console.log(pine2js(input));
        console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
