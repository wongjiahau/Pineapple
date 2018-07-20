import { expect } from "chai";
import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("@literal-object-LOB-001", () => {
    it("object literals", () => {
        const input =
`
def .main
    let y = 6

    let people =
        "name"  = "john"
        "age"   = 123
        "wife"  =
            "name" = "Natelie"
            "age"  = 99
        "yo" = 123

    let x = 5
`;
        const expectedOutput =
`
function _main_(){
const $y = (6);
const $people = {
name" : "john",
age" : (123),
wife" : {
name" : "Natelie",
age" : (99)
},
yo" : (123)
};
const $x = (5);
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
