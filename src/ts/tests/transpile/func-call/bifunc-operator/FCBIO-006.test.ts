import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCBIO-006", () => {
    it("generic type specialization", () => {
        const input =
`
def List{T}
    pass

def .main
    let x = [1,2,3].append(1)
    x.show

def (this List{T}).append(that T) -> List{T}
    pass

def (this List{Number}).show
    pass
`;
        const expectedOutput =
`
function _main_(){
const $x = _append_ListOfNumber_Number([(1),(2),(3)],(1));
_show_ListOfNumber($x);
}

function _append_ListOfGeneric$T_Generic$T($this,$that){
$$pass$$();
}

function _append_ListOfNumber_Number($this,$that){
$$pass$$();
}

function _show_ListOfNumber($this){
$$pass$$();
}

`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
