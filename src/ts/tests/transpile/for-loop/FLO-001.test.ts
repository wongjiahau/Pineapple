import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("FLO-001", () => {
    it("for loop 1", () => {
        const input =
`
def main:
    for i in 0 ..< 10
        print: i
`;
        const expectedOutput =
`
function _main(){

const itemsOfi = ((0)._$period$period$lessThan_Number((10)));
for(let i = 0; i < itemsOfi.length; i++){
    const $i = itemsOfi[i];
    $i._print()
};
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
