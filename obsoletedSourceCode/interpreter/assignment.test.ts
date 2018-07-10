import { expect } from "chai";
import { interpret } from "../../repl";

describe("assignment", () => {
    it("case 1", () => {
        const input = "let x<-5+99";
        const result = interpret(input);
        expect(result).to.eq("let x=(5+99);");
    });
});
