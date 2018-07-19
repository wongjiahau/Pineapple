import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FDNU-001", () => {
    it("case1", () => {
        const input =
`def .main
    pass
`;
        const expectedOutput =
`
function _main_(){
$$pass$$();
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });
});
