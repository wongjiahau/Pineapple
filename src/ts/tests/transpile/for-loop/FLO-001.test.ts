import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("FLO-001", () => {
    it("for loop 1", () => {
        const input =
`
def print: (this String)
    pass

def main:
    for i in ["a", "b", "c"]
        print: i
`;
        const expectedOutput =
`
String.prototype._print=function(){
const $this = this;
throw new Error('Not implemented yet!')

}

function _main(){

const itemsOfi = (new ArrayOfString(["a","b","c",]));
for(let i = 0; i < itemsOfi.length; i++){
    const $i = itemsOfi[i];
    $i._print()
};
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });
});
