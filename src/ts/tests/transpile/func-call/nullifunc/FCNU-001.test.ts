import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCNU-001", () => {
    it("nullifunc invocation", () => {
        const input =
`
def .main
    let x = .pi

def .pi -> Number
    pass

`;
        const expectedOutput =
`
function _main_(){
const $x = _pi_();
}

function _pi_(){
$$pass$$();
}

`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
