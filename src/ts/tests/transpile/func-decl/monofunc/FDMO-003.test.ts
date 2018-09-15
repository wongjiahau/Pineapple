import { assertEquals } from "../../../testUtil";

describe("FDMO-003", () => {
    it.skip("function that accepts function", () => {
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
    });

});
