import { expect } from "chai";
import { interpret } from "../../repl";

describe("assignment", () => {
    it("case 1", () => {
        const input = "let x<-5";
        interpret(input);
        const result = interpret("x");
        expect(result).to.eq(5);
    });
});
