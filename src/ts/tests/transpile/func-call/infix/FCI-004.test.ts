import { expect } from "chai";
import { pine2js } from "../../../../pine2js";

describe("FCI-004", () => {
    it("function call type inference", () => {
        const input =
`
def (this Number) (+) (that Number) -> Number
    print: "Not important here"

def main:
    let y = 6 + (6 + 6)
`;
        const expectedOutput =
`
Number.prototype._$plus_Number=function($that){
const $this = this;
"Not important here"._print()}

function _main(){
const $y = ((6)._$plus_Number(((6)._$plus_Number((6)))));
}

`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
