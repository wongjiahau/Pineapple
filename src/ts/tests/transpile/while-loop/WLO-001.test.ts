import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("WLO-001", () => {
    it("while loop 1", () => {
        const input =
`
def (this Number) (<) (that Number) -> Boolean
    pass

def (this Number) (+) (that Number) -> Number
    pass

def main:
    let x mutable = 0
    while x < 10
        x = x + 1
`;
        const expectedOutput =
`
Number.prototype._$lessThan_Number=function($that){
const $this = this;
}
Number.prototype._$plus_Number=function($that){
const $this = this;
}

function _main(){
const $x = (0);
while(($x._$lessThan_Number((10)))){
    x = ($x._$plus_Number((1)))
}
;
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
