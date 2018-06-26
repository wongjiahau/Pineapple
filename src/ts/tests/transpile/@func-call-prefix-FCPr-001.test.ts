import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("q003", () => {
    it("@func-call-prefix-FCPr-001", () => {
        const input =
`--function
main:
    print: 'hello world'
`;
        const expectedOutput =
`
function main(){
"hello world".print();
}`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
