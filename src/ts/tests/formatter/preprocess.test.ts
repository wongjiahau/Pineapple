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
        expect(input.split("\n").length).to.eq(result.split("\n").length);

    });

});
