import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FCBIN-001", () => {
    it("case 1", () => {
        const input =
`
def (this Number).add(that Number) -> Number
    pass

def .main
    let result = 1.add(2)
`;
        const expectedOutput =
`
function _add_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
const $result = _add_Number_Number((1),(2));
}
`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
