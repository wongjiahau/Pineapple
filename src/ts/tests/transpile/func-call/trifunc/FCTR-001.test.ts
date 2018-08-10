import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCTR-001", () => {
    it("case 1", () => {
        const input =
`
def (this String).replace(old String with new String) -> String
    pass

def .main
    let x = "1,2,3".replace("," with ".")
`;
        const expectedOutput =
`
function _replace_with_String_String_String($this,$old,$new){
$$pass$$();
}

function _main_(){
const $x = _replace_with_String_String_String("1,2,3",",",".");
}

`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
