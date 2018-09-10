import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("LOB-007", () => {
    it("generic struct", () => {
        const input =
`
def Node{T}
    :current T

def .main
    let x = Node{Number}
        :current = 123
`;
        const expectedOutput =
`
function _main_(){
const $x = {
$kind: "NodeOfNumber",
current : (123),
};
}

`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
