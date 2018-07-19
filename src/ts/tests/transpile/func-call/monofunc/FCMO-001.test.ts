import { expect } from "chai";
import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCMO-001", () => {
    it("case 1", () => {
        const input =
`
def (this String).show
    pass

def .main
    "hello world".show
`;
        const expectedOutput =
`
function _show_String($this){
$$pass$$();
}

function _main_(){
_show_String("hello world");
}


`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
