import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FDMO-003", () => {
    it("function that accepts function", () => {
        const input =
`
def (this List{T}).get(func Func{T,Boolean}) -> List{T}
    pass
`;
        const expectedOutput =
`
function _get_ListOfGeneric$T_FuncOfGeneric$T$Boolean($this,$func){
$$pass$$();
}

`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
