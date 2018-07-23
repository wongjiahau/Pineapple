import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCBIO-006", () => {
    it("generic type", () => {
    // Note that the input is an invalid function in Pineapple
    // This part is just to test the functionalit of recursive type inference
        const input =
`
def .main
    let x = "Hello" ++ "world"

def (this T[]) ++ (that T[]) -> T[]
    pass
`;
        const expectedOutput =
`
function _$minus$minus_Number_String($this,$that){
return _$minus$minus_Number_String($this,_$minus$minus_Number_String((5),$that));
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
