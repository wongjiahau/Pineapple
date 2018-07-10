import { expect } from "chai";
import { interpret } from "../../repl";

describe("array access", () => {
    it("case 1", () => {
        const input = "[10,20,30].(1)";
        const output = interpret(input);
        expect(output).to.eq("[10,20,30][1-1]");
        expect(eval(output)).to.eq(10);
    });

    it("case 2", () => {
        const input = "[10,20,30].(-1)";
        const output = interpret(input);
        expect(output).to.eq("[10,20,30][[10,20,30].length-1]");
        expect(eval(output)).to.eq(30);
    });
});
