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
String.prototype._print=function(){
const $this = this;
throw new Error('Not implemented yet!')

}

function _main(){
"hello world"._print();
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
