import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("@array-access-AAC-001", () => {
    it("case 1", () => {
        const input =
`
def main:
    let x = [1, 2, 3]
    let y = x[0]
`;
        const expectedOutput =
`
function _main(){
const $x = (new ArrayOfNumber([(1),(2),(3),]));
const $y = $x[(0)];
}
`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
