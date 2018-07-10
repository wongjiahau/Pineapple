import { expect } from "chai";
import { preprocess } from "../../preprocess";

describe("preprocess", () => {
    it("case 1", () => {
        const input =
`
if true
    x <- 5
    y <- 6
`;
        const result = preprocess(input);
        const expected =
`@NEWLINE
if true@NEWLINE@INDENT
    x <- 5@NEWLINE
    y <- 6@NEWLINE@DEDENT
`;
        expect(result).to.eq(expected);
    });

});
