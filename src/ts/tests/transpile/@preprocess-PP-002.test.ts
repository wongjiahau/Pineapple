import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@preprocess-PP-002", () => {
    it("should ignore consequtive newlines", () => {
        const input =
`
def print: (this String) -> Void
    <javascript>
    console.log($this.valueOf());
    </javascript>

def say: (this String) -> Void
    <javascript>
    console.log($this.valueOf());
    </javascript>

`;
        const expectedOutput =
`String.prototype.print=function(){
const $this = this;
// <javascript>
console.log($this.valueOf());
// </javascript>
}
String.prototype.say=function(){
const $this = this;
// <javascript>
console.log($this.valueOf());
// </javascript>
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
