import { expect } from "chai";
import { interpret } from "../../repl";

describe("primitive values", () => {
    describe("strings", () => {
        it("case 1", () => {
            const input = `"pineapple"`;
            const output = interpret(input);
            expect(output).to.eq('"pineapple"');
        });
    });
});
