import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("LOB-008", () => {
    it("generic struct", () => {
        const input =
`
def Tree{T}
    :children List{T}

def .main
    let x = Tree{Integer}
        :children = [1,2,3]
`;
        const expectedOutput =
`
function _main_(){
const $x = {
$kind: "TreeOfInteger",
children : [(1),(2),(3)],
};
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
