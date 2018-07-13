import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("BRA-002", () => {
    it("if elif elif else", () => {
        const input =
`def (this Number) (>) (that Number) -> Boolean
    pass

def main:
    if 1 > 2
        let a = "no"
    elif 2 > 3
        let b = "no"
    elif 3 > 4
        let c = "no"
    else
        let d = "oops"
`;
        const expectedOutput =
`
Number.prototype._$greaterThan_Number=function($that){
const $this = this;
throw new Error('Not implemented yet!')
}

function _main(){
if(((1)._$greaterThan_Number((2)))){
    const $a = "no"
} else if(((2)._$greaterThan_Number((3)))){
    const $b = "no"
} else if(((3)._$greaterThan_Number((4)))){
    const $c = "no"
} else {
    const $d = "oops"
}


;
}`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
