import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("@array-access-AAC-002", () => {
    it("case 1", () => {
        const input =
`
def .main
    let x = [1,2][0]
`;
        const expectedOutput =
`
function _main_(){
const $x = (new ArrayOfNumber([(1),(2),]))[(0)];
}
`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
