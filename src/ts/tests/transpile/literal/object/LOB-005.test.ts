import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("LOB-005", () => {
    it("returning object directly", () => {
        const input =
`
def People
    :name String

def .newPeople -> People
    return new People
        :name = "John"
`;
        const expectedOutput =
`
function _newPeople_(){
return {
$kind: "People",
name : "John"
};
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
