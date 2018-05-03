import { expect } from "chai";
import { interpret } from "../repl";

describe("interpret", () => {
    it("case 1", () => {
        const input = `
myFruit =
    .name = "Durian"
    .price = 100
    .sibiling =
        .price = 123
    .test = 1 + 1 * 0
`;
        const result = interpret(input);
        expect(result).to.deep.eq({
            name: "Durian",
            price: 100,
            sibiling: {
                price: 123
            },
            test: 1
        });
    });

});
