import { expect } from "chai";
import { pine2js } from "../../../../pine2js";
import { assertEquals } from "../../../testUtil";

describe("q003", () => {
    it("@func-call-prefix-FCPr-001", () => {
        const input =
`
def print: this String
    pass

def main:
    print: "hello world"
`;
        const expectedOutput =
`
function _print_String($this){
$$pass$$();
}

function _main_(){
_print_String("hello world");
}

`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
