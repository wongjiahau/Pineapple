import { expect } from "chai";
import { pine2js } from "../../../../pine2js";

describe("FCI-005", () => {
    it("recursive type inference", () => {
    // Note that the input is an invalid function in Pineapple
    // This part is just to test the functionalit of recursive type inference
        const input =
`
def (this Number) (--) (that String) -> String
    return this -- (5 -- that)
`;
        const expectedOutput =
`
Number.prototype._$minus$minus_String=function($that){
const $this = this;
return ($this._$minus$minus_String(((5)._$minus$minus_String($that))))}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
