import { expect } from "chai";
import { interpret } from "../../repl";

describe("multiple assignment", () => {
    it("case 1", () => {
        const input = `
let x <- 5
let y = 6
`;
        interpret(input);
        expect(interpret("x")).to.eq(5);
        expect(interpret("y")).to.eq(6);
    });

});
