import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("@literal-number-LNU-001", () => {
    it("every number should be surrounded by brackets", () => {
        const input =
`
def main:
    let x = 12345
`
;
        const expectedOutput =
`
function _main(){
const $x = (12345);
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
