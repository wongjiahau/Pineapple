import { expect } from "chai";
import { pine2js } from "../../../../pine2js";

describe("@func-call-infix-FCI-003", () => {
    it("double symbols", () => {
        const input =
`
def (this String) (++) (that String) -> String
    pass

def main:
    let y = "pine" ++ "apple"
`;
        const expectedOutput =
`
String.prototype._$plus$plus_String=function($that){
const $this = this;
throw new Error('Not implemented yet!')
}

function _main(){
const $y = ("pine"._$plus$plus_String("apple"));
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
