import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FDBI-002", () => {
    it("double equals", () => {
        const input =
`
def (x Any) == (y Any) -> Int
    <javascript>
    return $x === $y;
    </javascript>
`;
        const expectedOutput =
`
function _$equal$equal_Any_Any($x,$y){
// <javascript>
return $x === $y;
// </javascript>;
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
