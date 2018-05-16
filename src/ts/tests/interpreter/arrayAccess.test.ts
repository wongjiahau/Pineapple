import { expect } from "chai";
import { interpret } from "../../repl";

describe("array access", () => {
    it("case 1", () => {
        expect(interpret("[10,20,30].(1)")).to.eq(10);
    });

    it("case 2", () => {
        expect(interpret("[10,20,30].(-1)")).to.eq(30);
    });
});
