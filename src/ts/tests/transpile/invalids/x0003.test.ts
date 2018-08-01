import { expect } from "chai";
import { getFullFuncSignature } from "../../../generateErrorMessage";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("x0003", () => {
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
