import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("@branch-BRA-001", () => {
    it("if", () => {
        const input =
`
def (this Number) (>) (that Number) -> Boolean
    pass

def main:
    let x Number = 4
    let y Number = 6
    if x > y
        print: "yes"
    elif y > x
        print: "no"
    else
        print: "oops"
`;
        const expectedOutput =
`
Number.prototype._$greaterThan_Number=function($that){
const $this = this;
throw new Error('Not implemented yet!')
}

function _main(){
const $x = (4);
const $y = (6);
if(($x._$greaterThan_Number($y))){
    "yes"._print()
} else if(($y._$greaterThan_Number($x))){
    "no"._print()
} else {
    "oops"._print()
}

;
}

`.trim();

        const result = pine2js(input).trim();
        // console.log(expectedOutput);
        // console.log(result);
        expect(result).to.eq(expectedOutput);
    });

});
