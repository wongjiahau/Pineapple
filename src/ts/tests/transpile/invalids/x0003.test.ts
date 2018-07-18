import { expect } from "chai";
import { ErrorNoConformingFunction, PineError  } from "../../../errorType";
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
        const result = catchError(() => pine2js(input)) as PineError;
        const error = result.rawError as ErrorNoConformingFunction;
        const subject = getFullFuncSignature(error.func);
        const relatedFunctions = error.matchingFunctions.map((x) => getFullFuncSignature(x));
        expect(subject).to.eq(".print Number");
        expect(relatedFunctions).to.deep.eq([".print String"]);
    });
});
