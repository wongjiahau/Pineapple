import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("LOB-004", () => {
    it.skip("bodyless object", () => {
        const input =
`
def People
    pass

def .main
    let x = People
    let y = 6
`;
        const expectedOutput =
`
function _main_(){
const $x = {
$kind: "People",

};
const $y = (6);
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
