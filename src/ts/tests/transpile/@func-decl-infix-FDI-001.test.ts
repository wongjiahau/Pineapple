import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@func-decl-infix-FDI-001", () => {
    it("infix function declaration", () => {
        const input =
`
def (x Int) (+) (y Int) -> Int
    <javascript>
    return $x + $y;
    </javascript>
`;
        const expectedOutput =
`
Int.prototype._$plus_Int=function($y){
const $x = this;
// <javascript>
return $x + $y;
// </javascript>
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
