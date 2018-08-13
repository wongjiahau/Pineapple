import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCMO-005", () => {
    it("generic monofunc", () => {
        const input =
`
def (this T).show
    pass

def .main
    "Hello".show
`;
        const expectedOutput =
`
function _show_Generic$T($this){
$$pass$$();
}

function _show_String($this){
$$pass$$();
}

function _main_(){
_show_String("Hello");
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
