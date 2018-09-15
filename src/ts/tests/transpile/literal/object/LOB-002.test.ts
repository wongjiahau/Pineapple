import { assertEquals } from "../../../testUtil";

describe("LOB-002", () => {
    // Single line object is temporarily disable,
    // until its use case is justified
    it.skip("single line object", () => {
        const input =
`
def ().main
    let people = {"x"=2, "y"=2}

`;
        const expectedOutput =
`
function _main_(){
const $people = {
x" : (2),
y" : (2)
};
}
`;
    });

});
