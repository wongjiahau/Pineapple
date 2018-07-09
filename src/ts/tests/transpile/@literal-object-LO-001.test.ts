import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@literal-object-LO-001", () => {
    it("object literals", () => {
        const input =
`
def main:
    let y = 6

    let people =
        .name  = 'john'
        .age   = 123
        .wife  =
            .name = 'Natelie'
            .age  = 99

    let x = 5
`;
        const expectedOutput =
`
function main(){
const $y = new Int(6);
const $people = {
name : "john",
age : new Int(123),
wife : {
name : "Natelie",
age : new Int(99)
}
};
const $x = new Int(5);
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
