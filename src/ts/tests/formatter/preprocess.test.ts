import { expect } from "chai";
import { preprocess } from "../../preprocess";
import { dummySourceCode } from "../testUtil";


describe("preprocess", () => {
    it("case 1", () => {
        const input =
`

hello world


hello world


hello world



`;
        const result = preprocess(dummySourceCode(input));
        // 2 new lines will be added
        expect(input.split("\n").length + 2).to.eq(result.split("\n").length);

    });

});
