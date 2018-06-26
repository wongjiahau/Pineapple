import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("q010", () => {
    it("nested infix function call", () => {
        const input =
`
--function
main:
    let y = 6 + 6 + 6
`;
        const expectedOutput =
`
function main(){
const y = ((new Int(6).$plus_Int(new Int(6))).$plus_Int(new Int(6)));
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
