import { expect } from "chai";
import { preprocess } from "../../repl";

describe("preprocess", () => {
    it("case 1", () => {
        const input =
`
if true
    x <- 5
    y <- 6
`;
        const result = preprocess(input);
        const expected = "if true{     x <- 5;     y <- 6}";
        expect(result).to.eq(expected);
    });

});
