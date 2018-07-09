import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@preprocess-PP-001", () => {
    it("should ignore consecutive newlines", () => {
        const input =
`def main:
    print: "hello world"


`;
        const expectedOutput =
`
function _main(){
"hello world"._print();
}`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
