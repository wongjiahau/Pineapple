import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@func-decl-nofix-FDN-001", () => {
    it("case1", () => {
        const input =
`def main:
    let myName String = "123"
`;
        const expectedOutput =
`
function _main(){
const $myName = "123";
}
`;
        // console.log(pine2js(input));
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });
});
