import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@func-decl-prefix-FDPr-001", () => {
    it("case 1", () => {
        const input =
`
def show: (this Int[])
    print: "Not implemented"
`;
        const expectedOutput =
`
ArrayOfInt.prototype._show=function(){
const $this = this;
"Not implemented"._print()
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
