import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("ASL-001", () => {
    it("case 1", () => {
        const input =
`
def (this List{T}).(start Number : end Number) -> T
    pass

def .main
    let x = [1, 2, 3]
    let y = x.(0:1)
`;
        const expectedOutput =
`
function _$period_$colon_ListOfGeneric$T_Number_Number($this,$start,$end){
$$pass$$();
}

function _$period_$colon_ListOfNumber_Number_Number($this,$start,$end){
$$pass$$();
}

function _main_(){
const $x = [(1),(2),(3)];
const $y = _$period_$colon_ListOfNumber_Number_Number($x,(0),(1));
}

`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
