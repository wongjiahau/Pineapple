import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("VAR-001", () => {
    it("mutable variable", () => {
        const input =
`
def .main
    let x mutable = 1
    x = 2
`;
        const expectedOutput =
`
function _main_(){
let $x = (1);
$x = (2);
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
