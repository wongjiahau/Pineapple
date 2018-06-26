import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@literal-boolean-LB-001", () => {
    it("case1", () => {
        const input =
`
main:
    let x = true
`;
        const expectedOutput =
`
function main(){
const x = true;
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input)).to.eq(expectedOutput);
    });

    it("case2", () => {
        const input =
`
main:
    let y = false
`;
        const expectedOutput =
`
function main(){
const y = false;
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input)).to.eq(expectedOutput);
    });

});
