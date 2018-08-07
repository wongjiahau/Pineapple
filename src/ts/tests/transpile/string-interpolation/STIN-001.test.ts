import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe.skip("STIN-001", () => {
    it("case 1", () => {
        const input =
`
def .main
    let xs = "hello"" world"
`;
        const expectedOutput =
`
function _main(){
const $y = (6);
const $x = (8);
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
