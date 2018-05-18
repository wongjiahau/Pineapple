import { expect } from "chai";
import { interpret } from "../../repl";

describe("arithmetic", () => {
    it("negative numbers", () => {
        const input = "-123456";
        const output = interpret(input);
        expect(output).to.eq("(-123456)");
    });

    it("all binary arithmetic operator have same precedence", () => {
        const input = `-2+6-3*2/1%3`;
        const output = interpret(input);
        expect(output).to.eq("((((((-2)+6)-3)*2)/1)%3)");
        expect(eval(output)).to.eq(2);
    });

    it("power operator", () => {
        const input = `3^3`;
        const output = interpret(input);
        expect(output).to.eq("Math.pow(3,3)");
        expect(eval(output)).to.eq(27);
    });

    it("relational", () => {
        const operators = [">", "<", ">=", "<="];
        const expectedValues = [false, true, false, true, false, true];
        operators.forEach((x, index) => {
            const input = `2${x}3`;
            const output = interpret(input);
            expect(output).to.eq(`(2${x}3)`);
            expect(eval(output)).to.eq(expectedValues[index]);
        });
    });

    it("equal", () => {
        const input = `3==3`;
        const output = interpret(input);
        expect(output).to.eq("(3===3)");
    });

    it("not equal", () => {
        const input = `3!=3`;
        const output = interpret(input);
        expect(output).to.eq("(3!==3)");
    });
});
