import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("q1", () => {
    it("q001", () => {
        const input =
`iofunction
main >> Void
    let $myName:String << \`123\`
    print $myName
`;
        const expectedOutput =
`
function main() {
let $myName = "123";
prefix_print($myName);
}

`;
        expect(pine2js(input)).to.eq(expectedOutput);
    });

});
