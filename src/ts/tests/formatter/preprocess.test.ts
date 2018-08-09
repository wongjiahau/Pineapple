import { expect } from "chai";
import { preprocess } from "../../preprocess";

describe("preprocess", () => {
    it("case 1", () => {
        const input =
`

hello world


hello world


hello world



`;
        const result = preprocess(input);

        // 2 new lines will be added
        expect(input.split("\n").length + 2).to.eq(result.split("\n").length);

    });

});
