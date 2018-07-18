import { expect } from "chai";
import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("@func-call-infix-FCI-003", () => {
    it("double symbols", () => {
        const input =
`
def (this String) ++ (that String) -> String
    pass

def .main
    let y = "pine" ++ "apple"
`;
        const expectedOutput =
`
function _$plus$plus_String_String($this,$that){
$$pass$$();
}

function _main_(){
const $y = _$plus$plus_String_String("pine","apple");
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
