import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("x0004", () => {
    it("incorrect type signature for bifunction", () => {
        const input =
`def (this String).concat(that String) -> String
    pass

def .main
    let x = "123".concat(234)
`;
        expect(() => pine2js(input)).to.throws();
    });
});