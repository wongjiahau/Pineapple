import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("ASL-001", () => {
    it("case 1", () => {
        const input =
`
def (this List{T}).(start Integer to end Integer) -> T
    pass

def .main
    let x = [1, 2, 3]
    let y = x.(0 to 1)
`;
        const expectedOutput =
`
function _$period_to_ListOfGeneric$T_Integer_Integer($this,$start,$end){
$$pass$$();
}

function _$period_to_ListOfInteger_Integer_Integer($this,$start,$end){
$$pass$$();
}

function _main_(){
const $x = [(1),(2),(3)];
const $y = _$period_to_ListOfInteger_Integer_Integer($x,(0),(1));
}

`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
