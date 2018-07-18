import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCI-004", () => {
    it("function call type inference", () => {
        const input =
`
def (this Number) + (that Number) -> Number
    pass

def .main
    let y = 6 + (6 + 6)
`;
        const expectedOutput =
`
function _$plus_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
const $y = _$plus_Number_Number((6),_$plus_Number_Number((6),(6)));
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
