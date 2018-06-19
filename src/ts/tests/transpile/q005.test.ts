import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("q004", () => {
    it("should ignore consequting newlines", () => {
        const input =
`
@iofunction
print ($input:String) >> Void
    <javascript>
    console.log($input.valueOf());
    </javascript>

@iofunction
say ($input:String) >> Void
    <javascript>
    console.log($input.valueOf());
    </javascript>

`;
        const expectedOutput =
`String.prototype.print=function(){
let $input = this;
// <javascript>
console.log($input.valueOf());
// </javascript>
}
String.prototype.say=function(){
let $input = this;
// <javascript>
console.log($input.valueOf());
// </javascript>
}
`;
        console.log(pine2js(input));
        console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
