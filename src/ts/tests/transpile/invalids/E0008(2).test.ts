import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("E0008(2)", () => {
    it("incorrect type signature for bifunction", () => {
        const input =
`def (this String).concat(that String) -> String
    pass

def .main
    let x = "123".concat(234)
`;
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorNoConformingFunction");
    });
});
