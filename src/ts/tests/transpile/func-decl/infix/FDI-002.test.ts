import { expect } from "chai";
import { pine2js } from "../../../../pine2js";

describe("@func-decl-infix-FDI-002", () => {
    it("double equals", () => {
        const input =
`
def (x Any) (==) (y Any) -> Int
    <javascript>
    return $x === $y;
    </javascript>
`;
        const expectedOutput =
`
Any.prototype._$equal$equal_Any=function($y){
const $x = this;
// <javascript>
return $x === $y;
// </javascript>
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
