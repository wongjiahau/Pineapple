import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("VAR-001", () => {
    it("nullable variable", () => {
        const input =
`
def Nil
    #nil

def .main
    let x Number? = #nil
`;
        const expectedOutput =
`
function _main_(){
const $x = null;
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
