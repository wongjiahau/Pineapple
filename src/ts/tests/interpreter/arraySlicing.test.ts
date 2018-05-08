import { expect } from "chai";
import { interpret } from "../../repl";

describe("array slicing", () => {
    it("upper bound inclusive", () => {
        const input = "[1,2,3,4].(1..2)";
        const result = interpret(input);
        expect(result).to.deep.eq([2, 3]);
    });

    it("upper bound exclusive", () => {
        const input = "[1,2,3,4].(1..<3)";
        const result = interpret(input);
        expect(result).to.deep.eq([2, 3]);
    });

    it("no lower bound ", () => {
        const input = "[1,2,3,4].(..2)";
        const result = interpret(input);
        expect(result).to.deep.eq([1, 2, 3]);
    });

    it("no upper bound", () => {
        const input = "[1,2,3,4].(2..)";
        const result = interpret(input);
        expect(result).to.deep.eq([3, 4]);
    });

});
