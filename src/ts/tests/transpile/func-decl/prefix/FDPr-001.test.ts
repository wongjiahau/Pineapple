import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("@func-decl-prefix-FDPr-001", () => {
    it("case 1", () => {
        const input =
`
def show: (this Int[])
    let message = "Not implemented"
`;
        const expectedOutput =
`
ArrayOfInt.prototype._show=function(){
const $this = this;
const $message = "Not implemented"
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
