import { expect } from "chai";
import { ErrorVariableRedeclare, PineError } from "../../../errorType";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("x0001", () => {
    it("variable redeclaration", () => {
        const input =
`def main:
    let myName String = "123"
    let myName String = "123"
`;
        const result = catchError(() => pine2js(input)) as PineError;
        expect(result.rawError.kind).to.eq("ErrorVariableRedeclare");
    });
});
