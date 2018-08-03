import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("x0006", () => {
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
