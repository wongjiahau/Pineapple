import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("@func-decl-nofix-FDN-001", () => {
    it("case1", () => {
        const input =
`def main:
    let myName String = "123"
`;
        const expectedOutput =
`
function _main_(){
const $myName = "123";
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });
});
