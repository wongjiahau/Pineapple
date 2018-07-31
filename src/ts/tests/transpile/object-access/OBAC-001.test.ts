import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("LAR-003", () => {
    it("empty array", () => {
        const input =
`
def People
    'name String
    'age  Number

def .main
    let x = People
        'name = "Wong"
        'age  = 99

    let y = x'name
    y.show

def (this String).show
    pass
`;
        const expectedOutput =
`
function _main_(){
const $x = {
name : "Wong",
age : (99)
};
const $y = $x.name;
_show_String($y);
}

function _show_String($this){
$$pass$$();
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
