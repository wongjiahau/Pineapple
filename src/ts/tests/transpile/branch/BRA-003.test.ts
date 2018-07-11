import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("BRA-003", () => {
    it("if else without elif", () => {
        const input =
`
def (this Number) (>) (that Number) -> Boolean
    pass

def main:
    if 5 > 6
        return "ok"
    else
        return "no"
`;
        const expectedOutput =
`
Number.prototype._$greaterThan_Number=function($that){
const $this = this;
throw new Error('Not implemented yet!')
}

function _main(){
if(((5)._$greaterThan_Number((6)))){
    return "ok"
} else {
    return "no"
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
