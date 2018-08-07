import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("E0006(1)", () => {
    it("incorrect type for variable", () => {
        const input =
`
def .main
    let x Number = "abc"
`;
        // 'age member should take Number instead of String
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorIncorrectTypeGivenForVariable");
    });

});
