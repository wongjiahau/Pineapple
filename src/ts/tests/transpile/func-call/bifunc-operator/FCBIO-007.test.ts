import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCBIO-007", () => {
    it("recursive bifunc", () => {
        const input =
`
def (this List{T}) ++ (that List{T}) -> List{T}
    pass

def (this Integer) ..< (that Integer) -> List{Integer}
    return [0] ++ (1 ..< that)
`;
        const expectedOutput =
`

function _$plus$plus_ListOfGeneric$T_ListOfGeneric$T($this,$that){
$$pass$$();
}

function _$plus$plus_ListOfInteger_ListOfInteger($this,$that){
$$pass$$();
}

function _$period$period$lessThan_Integer_Integer($this,$that){
return _$plus$plus_ListOfInteger_ListOfInteger([(0)],_$period$period$lessThan_Integer_Integer((1),$that));
}

`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
