import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("ENUM-001", () => {
    it("boolean/null/undefined literal will be optimized", () => {
        const input =
`
def Boolean
    #true
    #false

def Nil
    #nil

def Undefined
    #undefined

def .main
    let x = #true
    let y = #false
    let z = #nil
    let a = #undefined
`;
        const expectedOutput =
`
function _main_(){
const $x = true;
const $y = false;
const $z = null;
const $a = undefined;
}
`;

        const result = pine2js(input);
        assertEquals(result.trim(), expectedOutput.trim());
    });

});
