import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("ENUM-001", () => {
    it("declaration", () => {
        const input =
`
def Color
    #red
    #green
    #blue

def .main
    let x Color = #green
`;
        // no output, because enum is not needed to be declared in JS
        const expectedOutput =
`
function _main_(){
const $x = {$kind: "_EnumColor", $value: "green"};
}
`;

        const result = pine2js(input);
        assertEquals(result.trim(), expectedOutput.trim());
    });

});
