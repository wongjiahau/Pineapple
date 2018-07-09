import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@func-decl-prefix-FDPr-001", () => {
    it("case 1", () => {
        const input =
`
def show: (this Int[])
    print: this
`;
        const expectedOutput =
`
Int.prototype.$plus_Int=function($y){
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
