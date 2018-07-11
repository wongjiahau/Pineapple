import { expect } from "chai";
import { pine2js } from "../../../../pine2js";

describe("@func-call-infix-FCI-001", () => {
    it("infix function call", () => {
        const input =
`
def (this Number) (+) (that Number) -> Number
    pass

def main:
    let x Number = 4
    let y Number = 6
    let result = x + y
`;
        const expectedOutput =
`
Number.prototype._$plus_Number=function($that){
const $this = this;
throw new Error('Not implemented yet!')
}

function _main(){
const $x = (4);
const $y = (6);
const $result = ($x._$plus_Number($y));
}
`.trim();

        const result = pine2js(input).trim();
        // console.log(result);
        // console.log(expectedOutput);
        expect(result).to.eq(expectedOutput);
    });

});
