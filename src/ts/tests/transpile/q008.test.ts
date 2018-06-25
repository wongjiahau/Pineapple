import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("q006", () => {
    it("object literals", () => {
        const input =
`
--function
main:
    let people =
        .name  = 'john'
        .age   = 123
        .wife  =
            .name = 'Natelie'
            .age  = 99
`;
        const expectedOutput =
`
function main(){
const people = {
name : "john",
age : new Int(123),
wife : {
name : "Natelie",
age : new Int(99)
}
};
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
