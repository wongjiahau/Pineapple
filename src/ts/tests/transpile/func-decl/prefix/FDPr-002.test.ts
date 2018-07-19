import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FDPr-002", () => {
    it("order of function declaration should not matter", () => {
        const input =
`
def .main
    "Hello".show

def (this String).show
    pass
`;
        const expectedOutput =
`
function _main_(){
_show_String("Hello");
}

function _show_String($this){
$$pass$$();
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
