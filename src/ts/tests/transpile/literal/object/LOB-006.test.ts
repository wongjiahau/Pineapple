import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("LOB-006", () => {
    it("recursive struct", () => {
        const input =
`
def Nil
    \`nil

def People
    'name   String
    'friend People?

def .newPeople -> People
    return People
        'name = "John"
        'friend = People
            'name = "Jane"
            'friend = \`nil
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
