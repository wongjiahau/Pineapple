import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("E0012(1)", () => {
    it("using non-existing struct", () => {
        const input =
`
def .main
    let x = People
        'name = "Wong"
        'age  = 99

    let y = x'name
`;
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorUsingUndefinedStruct");
    });

});
