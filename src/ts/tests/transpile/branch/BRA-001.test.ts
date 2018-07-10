import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("@branch-BRA-001", () => {
    it("if", () => {
        const input =
`
def main:
    let x Number = 4
    let y Number = 6
    if x moreThan: y
        print: "yes"
    elif x lessThan: y
        print: "no"
    else
        print: "oops"
`;
        const expectedOutput =
`
function _main(){
const $x = (4);
const $y = (6);
if(($x._moreThan_Number($y))){
    "yes"._print()
} else if(($x._lessThan_Number($y))){
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
