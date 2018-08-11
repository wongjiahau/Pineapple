import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe.skip("CUR-004", () => {
    it("double parameter lambda", () => {
        const input =
`
def .main
    let x = _ > _
`;
        const expectedOutput =
`
function _main_(){
const $x = (($$0,$$1) => _$greaterThan($$0,$$1));
}

`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });
});
