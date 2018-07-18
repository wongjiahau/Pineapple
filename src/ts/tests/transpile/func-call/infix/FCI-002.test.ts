import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("@func-call-infix-FCI-002", () => {
    it("nested infix function call", () => {
        const input =
`
def (this Number) + (that Number) -> Number
    pass

def .main
    let y = 6 + 6 + 6
`;
        const expectedOutput =
`
function _$plus_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
const $y = _$plus_Number_Number(_$plus_Number_Number((6),(6)),(6));
}`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
