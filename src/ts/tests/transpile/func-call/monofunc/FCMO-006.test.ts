import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCMO-002", () => {
    it("parent type inference", () => {
        const input =
`
def (this Any).show
    pass

def .main
    "Hello".show
`;
        const expectedOutput =
`
function _show_Any($this){
$$pass$$();
}

function _main_(){
_show_Any("Hello");
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
