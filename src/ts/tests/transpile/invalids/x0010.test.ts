import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("x0009", () => {
    it("incorrect type", () => {
        const input =
`
def People
    'name String
    'age  Number

def .main
    let x = People
        'name = "Wong"
        'age  = "eighty"
`;
        // 'age member should take Number instead of String
        expect(() => pine2js(input)).to.throws();
    });

});
