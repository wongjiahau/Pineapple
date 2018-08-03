import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("x0014", () => {
    it("syntax error", () => {
        const input =
`
def .main
    let x = "12
`;
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorSyntax");
    });

});
