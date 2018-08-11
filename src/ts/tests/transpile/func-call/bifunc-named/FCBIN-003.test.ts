import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCBIN-003", () => {
    it("generic binary function", () => {
        const input =
`
def (this List{T}) ++ (that List{T}) -> List{T}
    pass

def (this List{T}).append(that T) -> List{T}
    return this ++ [that]
`;
        const expectedOutput =
`
function _$plus$plus_ListOfGeneric$T_ListOfGeneric$T($this,$that){
$$pass$$();
}

function _append_ListOfGeneric$T_Generic$T($this,$that){
return _$plus$plus_ListOfGeneric$T_ListOfGeneric$T($this,[$that]);
}
`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
