import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FDMO-003", () => {
    it("function that accepts function", () => {
        const input =
`
def Func{T1,T2}
    pass

def (this List{T}).get(func Func{T,Bool}) -> List{T}
    pass
`;
        const expectedOutput =
`
function _get_ListOfGeneric$T_FuncOfGeneric$T1$Generic$T2($this,$func){
$$pass$$();
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
