import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

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
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorExtraMember");
    });

});
