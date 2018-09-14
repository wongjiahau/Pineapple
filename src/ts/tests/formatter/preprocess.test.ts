import { expect } from "chai";
import { preprocess } from "../../preprocess";
import { dummySourceCode, assertFail } from "../testUtil";
import { isFail } from "../../fillUpTypeInformation";

describe("preprocess", () => {
    it("should maintain the number of lines", () => {
        const input =
`

hello world


hello world


hello world



`;
        const result = preprocess(dummySourceCode(input));
        if(isFail(result)) return assertFail("");
        // 2 new lines will be added
        expect(input.split("\n").length + 2).to.eq(result.value.split("\n").length);

    });

    it("should be able to process tabs", () => {
        const input = "def ().main\n\tlet x = 3";
        expect(() => {
            preprocess(dummySourceCode(input));
        }).to.not.throws();
    });

});
