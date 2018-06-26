import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@literal-list-LL-001", () => {
    it("case1", () => {
        const input =
`
--function
main:
    let x = [1.1 2.2 3.3 4.4]
`;
        const expectedOutput =
`
function main(){
const x = [(1.1),(2.2),(3.3),(4.4),];
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
