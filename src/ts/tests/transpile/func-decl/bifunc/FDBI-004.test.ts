import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FDBI-003", () => {
    it("void bifunc", () => {
        const input =
`
def (this Number).squeeze(that Number)
    pass
`;
        const expectedOutput =
`
function _squeeze_Number_Number($this,$that){
$$pass$$();
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
