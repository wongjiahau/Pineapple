import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@literal-javascript-LJ-001", () => {
    it("case1", () => {
        const input =
`--function
print: message as String -> Void
    <javascript>
    console.log(message);
    </javascript>
`;
        const expectedOutput =
`String.prototype.print=function(){
let message = this;
// <javascript>
console.log(message);
// </javascript>
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input)).to.eq(expectedOutput);
    });

});
