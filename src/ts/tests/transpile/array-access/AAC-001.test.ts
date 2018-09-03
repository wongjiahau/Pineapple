import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("@array-access-AAC-001", () => {
    it("case 1", () => {
        const input =
`
def (this List{T}).(that Number) -> T
    pass

def .main
    let x = [1, 2, 3]
    let y = x.(0)
`;
        const expectedOutput =
`
function _$period_ListOfGeneric$T_Number($this,$that){
$$pass$$();
}

function _$period_ListOfInteger_Number($this,$that){
$$pass$$();
}

function _main_(){
const $x = [(1),(2),(3)];
const $y = _$period_ListOfInteger_Number($x,(0));
}
`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
