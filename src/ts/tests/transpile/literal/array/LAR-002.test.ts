import { expect } from "chai";
import { pine2js } from "../../../../pine2js";

describe.skip("@literal-array-LAR-002", () => {
    it("multiline lists", () => {
        const input =
`
def main:
    let fruits =
        o "pineapple"
        o "apple"
        o "banana"
`
;
        const expectedOutput =
`
function _main(){
const $fruits = (new ArrayOfString(["pineapple","apple","banana",]));
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
