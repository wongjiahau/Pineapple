import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("E0011(1)", () => {
    it("wrong return type", () => {
        const input =
`
def .pi -> Number
    return "3.142"
`;
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorUnmatchingReturnType");
    });

});
