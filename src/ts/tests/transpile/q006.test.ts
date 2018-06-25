import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("q006", () => {
    it("infix function declaration", () => {
        const input =
`
--function
x as Int (+) y as Int -> Int
    <javascript>
    return x + y;
    </javascript>
`;
        const expectedOutput =
`
Int.prototype.$plus_Int=function(y){
const x = this;
// <javascript>
return x + y;
// </javascript>
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
