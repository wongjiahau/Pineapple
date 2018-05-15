import { expect } from "chai";
import { interpret } from "../../repl";

describe("if statement", () => {
    it("case 1", () => {
        const input = `
if true
    x <- 5
`;
        interpret(input);
        expect(interpret("x")).to.eq(5);
    });

    it("case 1", () => {
        const input = `
let y <- 6

if false
    y <- 5
`;
        interpret(input);
        expect(interpret("y")).to.eq(6);
    });
});
