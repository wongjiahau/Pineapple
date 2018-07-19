import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCMO-004", () => {
    it("chaining multiple monofunc", () => {
        const input =
`
def (this String).capitalize -> String
    pass

def (this String).reverse -> String
    pass

def .main
    "Hello".capitalize.reverse
`;
        const expectedOutput =
`
function _capitalize_String($this){
$$pass$$();
}

function _reverse_String($this){
$$pass$$();
}

function _main_(){
_reverse_String(_capitalize_String("Hello"));
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
