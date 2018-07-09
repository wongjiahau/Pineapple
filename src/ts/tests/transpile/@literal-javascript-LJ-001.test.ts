import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@literal-javascript-LJ-001", () => {
    it("case1", () => {
        const input =
`def print: (this String) -> Void
    <javascript>
    console.log($this);
    </javascript>
`;
        const expectedOutput =
`String.prototype.print=function(){
let $this = this;
// <javascript>
console.log($this);
// </javascript>
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input)).to.eq(expectedOutput);
    });

});
