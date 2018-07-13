import { expect } from "chai";
import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("@func-decl-infix-FDI-001", () => {
    it("infix function declaration", () => {
        const input =
`
def (x Int) (+) (y Int) -> Int
    <javascript>
    return $x + $y;
    </javascript>
`;
        const expectedOutput =
`
function _$plus_Int_Int($x,$y){
// <javascript>
return $x + $y;
// </javascript>;
}

`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
