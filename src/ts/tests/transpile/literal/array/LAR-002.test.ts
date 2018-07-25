import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("@literal-array-LAR-002", () => {
    it("multiline lists", () => {
        const input =
`
def .main
    let fruits =
        o "pineapple"
        o "apple"
        o "banana"
`
;
        const expectedOutput =
`
function _main_(){
const $fruits = ["pineapple","apple","banana"];
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
