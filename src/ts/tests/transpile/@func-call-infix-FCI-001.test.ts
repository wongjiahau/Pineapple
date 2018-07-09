import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@func-call-infix-FCI-001", () => {
    it("infix function call", () => {
        const input =
`
def main:
    let x Int = 4
    let y Int = 6
    let result = x + y
`;
        const expectedOutput =
`
function main(){
const $x = new Int(4);
const $y = new Int(6);
const $result = ($x.$plus_Int($y));
}
`.trim();

        const result = pine2js(input).trim();
        // console.log(expectedOutput);
        // console.log(result);
        expect(result).to.eq(expectedOutput);
    });

});
