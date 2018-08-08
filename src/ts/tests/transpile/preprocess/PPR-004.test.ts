import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("@preprocess-PP-004.test.ts", () => {
    it("should auto add missing newline at EOF", () => {
        const input =
`def .main
    let y = 6`;
        const expectedOutput =
`
function _main_(){
const $y = (6);
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
