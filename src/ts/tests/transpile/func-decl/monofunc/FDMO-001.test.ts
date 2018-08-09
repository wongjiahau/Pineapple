import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FDMO-001", () => {
    it("case 1", () => {
        const input =
`
def (this String).show
    pass
`;
        const expectedOutput =
`
function _show_String($this){
$$pass$$();
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
