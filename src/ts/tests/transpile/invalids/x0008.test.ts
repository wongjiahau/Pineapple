import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("x0008", () => {
    it("missing member", () => {
        const input =
`
def People
    'name String
    'age  Number

def .main
    let x = People
        'name = "Wong"
`;
        // 'age member is missing
        expect(() => pine2js(input)).to.throws();
    });

});
