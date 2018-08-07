import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("E0007(1)", () => {
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
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorMissingMember");
    });

});
