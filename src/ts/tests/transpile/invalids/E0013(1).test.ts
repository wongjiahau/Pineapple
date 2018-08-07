import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("E0013(1)", () => {
    it("using unknown named-infix function", () => {
        const input =
`def .main
    let x = 1.plus(2)
`;
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorUsingUnknownFunction");
    });
});
