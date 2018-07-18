import { expect } from "chai";
import { PineError } from "../../../errorType";
import { getFuncSignature } from "../../../generateErrorMessage";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";
import { ErrorUsingUnknownFunction } from "./../../../errorType";

describe("x0002", () => {
    it("using unknown named-infix function", () => {
        const input =
`def .main
    let x = 1 plus: 2
`;
        const result = catchError(() => pine2js(input)) as PineError;
        const error = result.rawError as ErrorUsingUnknownFunction;
        expect(getFuncSignature(error.func.signature)).to.eq("plus:");
    });
});
