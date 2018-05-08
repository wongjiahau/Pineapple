import { expect } from "chai";
import { interpret } from "../../repl";

describe("object member access", () => {
    it("case 1", () => {
        const input = "let x={.age=3}";
        interpret(input);
        const result = interpret("x.age");
        expect(result).to.eq(3);

    });

});
