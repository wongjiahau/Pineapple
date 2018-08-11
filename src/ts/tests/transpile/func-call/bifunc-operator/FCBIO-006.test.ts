import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCBIO-006", () => {
    it("generic type specialization", () => {
        const input =
`
def .main
    let x = [1,2,3].append(1).append(3)

def (this List{T}).append(that T) -> List{T}
    pass
`;
        const expectedOutput =
`
function _main_(){
const $x = _append_ListOfInt_Int(_append_ListOfInt_Int([(1),(2),(3)],(1)),(3));
}

function _append_ListOfGeneric$T_Generic$T($this,$that){
$$pass$$();
}

function _append_ListOfInt_Int($this,$that){
$$pass$$();
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
