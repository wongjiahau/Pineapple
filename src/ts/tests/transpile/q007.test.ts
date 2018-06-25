import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("q006", () => {
    it("infix function call", () => {
        const input =
`
--function
main:
    let x as Int = 4
    let y as Int = 6
    let result = x + y
`;
        const expectedOutput =
`
function main(){
const x = 4;
const y = 6;
const result = x.$plus_Int(y);
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
