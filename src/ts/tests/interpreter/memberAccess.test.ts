import { expect } from "chai";
import { interpret } from "../../repl";

describe("object member access", () => {
    it("case 1", () => {
        const input = "let x={ .bro={ .bro={ .name='john'}}}";
        interpret(input);
        const result = interpret("x.bro.bro.name");
        expect(result).to.eq("john");

    });

    it("case 2", () => {
        const input = "let x={ .name='hey'}";
        interpret(input);
        const result = interpret("x.name");
        expect(result).to.eq("hey");

    });

});
