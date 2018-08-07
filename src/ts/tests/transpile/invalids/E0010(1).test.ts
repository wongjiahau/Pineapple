import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("E0010(1)", () => {
    it("syntax error", () => {
        const input =
`
def .main
    let x = "12
`;
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorSyntax");
    });

});
