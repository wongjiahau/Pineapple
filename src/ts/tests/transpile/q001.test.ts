import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("q001", () => {
    it("case1", () => {
        const input =
`iofunction
main >> Void
    let $myName:String << \`123\`
`;
        const expectedOutput =
`
function nofix_main_() {
let $myName = "123";
}
`;
        // console.log(pine2js(input));
        expect(pine2js(input)).to.eq(expectedOutput);
    });

});
