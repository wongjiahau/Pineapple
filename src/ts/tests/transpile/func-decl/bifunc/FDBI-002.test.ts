import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FDBI-002", () => {
    it("double equals", () => {
        const input =
`
def (x Number) == (y Number) -> Number
    pass
`;
        const expectedOutput =
`
function _$equal$equal_Number_Number($x,$y){
$$pass$$();
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
