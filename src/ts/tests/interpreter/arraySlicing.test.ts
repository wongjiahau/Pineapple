import { expect } from "chai";
import { interpret } from "../../repl";

describe("array slicing", () => {
    it("upper bound inclusive", () => {
        const input = "[1,2,3,4].(2..3)";
        const output = interpret(input);
        expect(output).to.eq("[1,2,3,4].slice(2-1,3)");
        expect(eval(output)).to.deep.eq([2, 3]);
    });

    it("upper bound exclusive", () => {
        const input = "[1,2,3,4].(2..<4)";
        const output = interpret(input);
        expect(output).to.eq("[1,2,3,4].slice(2-1,4-1)");
        expect(eval(output)).to.deep.eq([2, 3]);
    });

    it("no lower bound ", () => {
        const input = "[1,2,3,4].(..3)";
        const output = interpret(input);
        expect(output).to.eq("[1,2,3,4].slice(1-1,3)");
        expect(eval(output)).to.deep.eq([1, 2, 3]);
    });

    it("no lower bound, upper bound exclusive ", () => {
        const input = "[1,2,3,4].(..<3)";
        const output = interpret(input);
        expect(output).to.eq("[1,2,3,4].slice(1-1,3-1)");
        expect(eval(output)).to.deep.eq([1, 2]);
    });

    it("no upper bound", () => {
        const input = "[1,2,3,4].(3..)";
        const output = interpret(input);
        expect(output).to.eq("[1,2,3,4].slice(3-1)");
        expect(eval(output)).to.deep.eq([3, 4]);
    });

});
