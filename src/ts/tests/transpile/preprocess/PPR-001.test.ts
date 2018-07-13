import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("@preprocess-PP-001", () => {
    it("should ignore consecutive newlines", () => {
        const input =
`def main:
    let x = "hello world"


`;
        const expectedOutput =
`
function _main(){
const $x = "hello world";
}`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
