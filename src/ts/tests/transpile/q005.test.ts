import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("q005", () => {
    it("should ignore consequting newlines", () => {
        const input =
`
--function
print: input as String -> Void
    <javascript>
    console.log(input.valueOf());
    </javascript>

--function
say: input as String -> Void
    <javascript>
    console.log(input.valueOf());
    </javascript>

`;
        const expectedOutput =
`String.prototype.print=function(){
let input = this;
// <javascript>
console.log(input.valueOf());
// </javascript>
}
String.prototype.say=function(){
let input = this;
// <javascript>
console.log(input.valueOf());
// </javascript>
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
