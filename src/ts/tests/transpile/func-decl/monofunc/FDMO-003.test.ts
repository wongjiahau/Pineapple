import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("FDMO-003", () => {
    it("function that accepts function", () => {
        const input =
`
def (this Number[]).get(func (Number->Boolean)) -> Number[]
    pass
`;
        const expectedOutput =
`
function _get_ArrayOfNumber_Func$Number$Boolean($this,$func){
$$pass$$();
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
