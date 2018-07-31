import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("x0009", () => {
    it("extra member", () => {
        const input =
`
def People
    'name String
    'age  Number

def .main
    let x = People
        'name = "Wong"
        'age  = 88
        'wife = "Jane"
`;
        // 'age member is missing
        expect(() => pine2js(input)).to.throws();
    });

});
