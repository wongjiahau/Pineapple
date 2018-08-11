import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("LAR-003", () => {
    it("empty array", () => {
        const input =
`
def .main
    let x List{String} = []
`;
        const expectedOutput =
`
function _main_(){
const $x = [];
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
/*

// Some idea
class ArrayOfString extends Array {
    constructor(xs) {
        super(...xs);
    }
}

let xs = new ArrayOfString([1,2,3])

*/
