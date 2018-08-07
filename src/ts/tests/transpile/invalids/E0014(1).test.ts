import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("E0014(1)", () => {
    it("variable redeclaration", () => {
        const input =
`def .main
    let myName String = "123"
    let myName String = "123"
`;

        expect(catchError(() => pine2js(input)).name).to.eq("ErrorVariableRedeclare");
    });
});
