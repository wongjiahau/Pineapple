import { expect } from "chai";
import { interpret } from "../../repl";

describe("if statement", () => {
    it("if only 1", () => {
        const input = `
if true
    x <- 5
`;
        interpret(input);
        expect(interpret("x")).to.eq(5);
    });

    it("if only 2", () => {
        const input = `
let y <- 6

if false
    y <- 5
`;
        interpret(input);
        expect(interpret("y")).to.eq(6);
    });

    it("if and else", () => {
        const input = `
if false
    y <- 5
else
    y <- 6
`;
        interpret(input);
        expect(interpret("y")).to.eq(6);
    });

    it("if elif else", () => {
        const input = `
if false
    y <- 5
elif false
    y <- 6
else
    y <- 7
`;
        interpret(input);
        expect(interpret("y")).to.eq(7);
    });
});
