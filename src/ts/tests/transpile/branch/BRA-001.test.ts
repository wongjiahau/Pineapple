import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

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
        let a = "yes"
    elif y > x
        let b = "no"
    else
        let c = "oops"
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
    const $a = "yes"
} else if(($y._$greaterThan_Number($x))){
    const $b = "no"
} else {
    const $c = "oops"
}

;
}
`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
