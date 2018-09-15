import { assertEquals } from "../../testUtil";

describe.skip("CUR-001", () => {
    it("case 1", () => {
        const input =
`
def ().main
    let x = _.isPrime

def (this Number).isPrime -> Boolean
    pass
`;
        const expectedOutput =
`
function _main_(){
const $x = (($$0) => _isPrime($$0));
}
`;
    });
});
