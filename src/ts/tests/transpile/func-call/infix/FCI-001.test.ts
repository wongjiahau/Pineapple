import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("@func-call-infix-FCI-001", () => {
    it("infix function call", () => {
        const input =
`
def (this Number) + (that Number) -> Number
    pass

def .main
    let x Number = 4
    let y Number = 6
    let result = x + y
`;
        const expectedOutput =
`
function _$plus_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
const $x = (4);
const $y = (6);
const $result = _$plus_Number_Number($x,$y);
}

`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
