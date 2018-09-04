import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("BRA-004", () => {
    it("precedence should follows left to right", () => {
        const input =
`
def Boolean
    \`true
    \`false

def .main
    if \`true or \`false and \`true 
        return "ok"
`;
        const expectedOutput =
`
function _main_(){
if((((true) || false) && true)){
return "ok"
};
}
`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
