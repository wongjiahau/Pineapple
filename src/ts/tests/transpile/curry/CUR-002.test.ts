import { assertEquals } from "../../testUtil";

describe.skip("CUR-002", () => {
    it("case 1", () => {
        const input =
`
def ().main
    let x = _ > 2
`;
        const expectedOutput =
`
function _main_(){
const $x = (($$0) => _$greaterThan($$0, (2)));
}
`;
    });
});
