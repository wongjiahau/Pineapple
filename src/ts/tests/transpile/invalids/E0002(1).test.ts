import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("E0002(1)", () => {
    it("assigning value to immutable variable", () => {
        const input =
`
def .main
    let x = 12
    x = 5
`;
        expect(catchError(() => pine2js(input)).name)
        .to.eq("ErrorAssigningToImmutableVariable");
    });

});
