import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("@literal-list-LL-002", () => {
    it("multiline lists", () => {
        const input =
`
--function
main:
    let fruits =
        o 'pineapple'
        o 'apple'
        o 'banana'
`;
        const expectedOutput =
`
function main(){
const fruits = ["pineapple","apple","banana",];
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
