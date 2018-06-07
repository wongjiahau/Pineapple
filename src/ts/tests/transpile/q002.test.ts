import { expect } from "chai";
import { pine2js } from "../../pine2js";

describe("q002", () => {
    it("case1", () => {
        const input =
`iofunction
print $input:String >> Void
    <javascript>
    console.log($input);
    </javascript>
`;
        const expectedOutput =
`
function prefix_print_String($input) {
// <javascript>
console.log($input);
// </javascript>
;
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input)).to.eq(expectedOutput);
    });

});
