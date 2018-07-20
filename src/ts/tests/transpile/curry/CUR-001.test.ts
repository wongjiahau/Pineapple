import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("CUR-001", () => {
    it("case 1", () => {
        const input =
`
def .main
    let x = _.isPrime
`;
        const expectedOutput =
`
function _main_(){
const $x = (($$0) => _isPrime($$0));
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });
});
