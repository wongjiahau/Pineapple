import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("x0006", () => {
    it("accessing non-existent member", () => {
        const input =
`
def People
    'name String
    'age  Number

def .main
    let x = People
        'name = "Wong"
        'age  = 99

    let y = x'nam
`;
        expect(() => pine2js(input)).to.throws();
    });

});
