import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("@array-access-AAC-003", () => {
    it("type inference on array element", () => {
        const input =
`
def (this Number) + (that Number) -> Number
    pass

def .main
    let x = [1,2][0] + [2,3][0]
`;
        const expectedOutput =
`
function _$plus_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
const $x = _$plus_Number_Number([(1),(2),][(0)],[(2),(3),][(0)]);
}
`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
