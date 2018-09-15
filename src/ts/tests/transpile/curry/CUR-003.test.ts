import { assertEquals } from "../../testUtil";

describe.skip("CUR-003", () => {
    it("case 1", () => {
        const input =
`
def ().main
    let x = 2 > _
`;
        const expectedOutput =
`
function _main_(){
const $x = (($$0) => _$greaterThan((2), $$0));
}
`;
    });
});
