import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("LOB-002", () => {
    it("single line object", () => {
        const input =
`
def .main
    let people = {"x"=2, "y"=2}

`;
        const expectedOutput =
`
function _main_(){
const $people = {
x" : (2),
y" : (2)
};
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
