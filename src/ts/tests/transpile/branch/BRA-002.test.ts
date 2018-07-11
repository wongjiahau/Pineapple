import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("BRA-002", () => {
    it("if elif elif else", () => {
        const input =
`
def (this Number) (>) (that Number) -> Boolean
    pass

def main:
    if 1 > 2
        print: "no"
    elif 2 > 3
        print: "no"
    elif 3 > 4
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
if(((1)._$greaterThan_Number((2)))){
    "no"._print()
} else if(((2)._$greaterThan_Number((3)))){
    "no"._print()
} else if(((3)._$greaterThan_Number((4)))){
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
