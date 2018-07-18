import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCI-007", () => {
    it("should find for more specific type if possible", () => {
        const input =
`
def (this Any).show
    pass

def (this String).show
    pass

def .main
    "Hello".show
`;
        const expectedOutput =
`

function _show_Any($this){
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
