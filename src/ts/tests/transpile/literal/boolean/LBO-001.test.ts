import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("LBO-001", () => {
    it("case1", () => {
        const input =
`
def main:
    let x = true
`;
        const expectedOutput =
`
function _main_(){
const $x = true;
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

    it("case2", () => {
        const input =
`
def main:
    let y = false
`;
        const expectedOutput =
`
function _main_(){
const $y = false;
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
