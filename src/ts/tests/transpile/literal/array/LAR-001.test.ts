import { expect } from "chai";
import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("@literal-array-LAR-001", () => {
    it("list with some elements", () => {
        const input =
`
def .main
    let x = [1.1, 2.2, 3.3, 4.4]
`;
        const expectedOutput =
`
function _main_(){
const $x = (new ArrayOfNumber([(1.1),(2.2),(3.3),(4.4),]));
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
