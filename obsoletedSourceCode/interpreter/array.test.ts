import { expect } from "chai";
import { interpret } from "../../repl";

describe("array", () => {
    it("number array", () => {
        const input = "[1.3,-2,3+3]";
        const result = interpret(input);
        expect(result).to.deep.eq([1.3, -2, 6]);
    });

    it("string array", () => {
        const input = '["a","b","c"]';
        const result = interpret(input);
        expect(result).to.deep.eq(["a", "b", "c"]);
    });

    it("nested array", () => {
        const input = "[[0,1],[1,2],[3,4]]";
        const result = interpret(input);
        expect(result).to.deep.eq([[0, 1], [1, 2], [3, 4]]);
    });
});
