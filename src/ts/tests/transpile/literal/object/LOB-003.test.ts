import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("LOB-003", () => {
    it("object literals with member key", () => {
        const input =
`
def People
    :name   String
    :age    Number

def .main
    let people = new People
        :name  = "john"
        :age   = 123
`;
        const expectedOutput =
`
function _main_(){
const $people = {
$kind: "People",
name : "john",
age : (123)
};
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
