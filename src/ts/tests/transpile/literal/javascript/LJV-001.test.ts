import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("@literal-javascript-LJ-001", () => {
    it("case1", () => {
        const input =
`def (this String).print
    <javascript>
    console.log($this);
    </javascript>
`;
        const expectedOutput =
`
function _print_String($this){
// <javascript>
console.log($this);
// </javascript>
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
