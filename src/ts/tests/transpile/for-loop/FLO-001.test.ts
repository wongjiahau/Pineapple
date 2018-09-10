import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("FLO-001", () => {
    it("for loop 1", () => {
        const input =
`
def (this String).print
    pass

def .main
    for i in ["a", "b", "c"]
        i.print
`;
        const expectedOutput =
`
function _print_String($this){
$$pass$$();
}

function _main_(){
const itemsOfi = ["a","b","c"];
for(let i = 0; i < itemsOfi.length; i++){
const $i = itemsOfi[i];
_print_String($i);
}
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });
});
