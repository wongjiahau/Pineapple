import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("E0008(1)", () => {
    it("passing inappropriate signature to function", () => {
        const input =
`def (this String).print
    pass

def .main
    123.print
`;
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorNoConformingFunction");
    });
});
