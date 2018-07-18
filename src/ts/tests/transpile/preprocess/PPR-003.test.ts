import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("@preprocess-PP-003.test.ts", () => {
    it("should ignore dangling newlines", () => {
        const input =
`
def .main
    let y = 6


    let x = 8
`;
        const expectedOutput =
`
function _main_(){
const $y = (6);
const $x = (8);
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
