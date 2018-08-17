import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("tuple", () => {
    it("case", () => {
        const input =
`
def .main
    let tuple = (1, "2", 3)
`;
        const expectedOutput =
`
function _main_(){
const $tuple = [(1),"2",(3)];
}
`;

        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });
});
