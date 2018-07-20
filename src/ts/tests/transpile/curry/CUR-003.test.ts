import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("CUR-003", () => {
    it("case 1", () => {
        const input =
`
def .main
    let x = 2 > _
`;
        const expectedOutput =
`
function _main_(){
const $x = (($$0) => _$greaterThan((2), $$0));
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });
});
