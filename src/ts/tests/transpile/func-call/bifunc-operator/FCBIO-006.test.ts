import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCBIO-006", () => {
    it("generic type", () => {
        const input =
`
def .main
    let x = [1,2,3].append(1)
    x.show 
    
def (this T[]).append(that T) -> T[]
    pass

def (this Number[]).show
    pass
`;
        const expectedOutput =
`
function _main_(){
const $x = _append_ArrayOfNumber_Number([(1),(2),(3),],(1));
_show_ArrayOfNumber($x);
}

function _append_ArrayOfGeneric$T_Generic$T($this,$that){
$$pass$$();
}

function _append_ArrayOfNumber_Number($this,$that){
$$pass$$();
}

function _show_ArrayOfNumber($this){
$$pass$$();
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
