import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("x001", () => {
    it("duplicated variables", () => {
        const input =
`--function
main: -> Void
    let myName as String = '123'
    let myName as String = '123'
`;
        // console.log(pine2js(input));
        expect(() => pine2js(input)).to.throws("Variable `myName` is already assigned (at line 4 column 8)");
    });
});
