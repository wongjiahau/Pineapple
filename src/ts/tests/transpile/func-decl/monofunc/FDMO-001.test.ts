import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FDMO-001", () => {
    it("case 1", () => {
        const input =
`
def (this List{Int}).show
    pass
`;
        const expectedOutput =
`
function _show_ListOfInt($this){
$$pass$$();
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
