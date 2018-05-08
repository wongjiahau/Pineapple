import { expect } from "chai";
import { interpret } from "../../repl";

describe("interpret", () => {
    it("case 1", () => {
        const input = `
let myFruit =
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

    it("case 2", () => {
        const input = "let x={.price=6.age=2}";
        interpret(input);
        expect(interpret("x")).to.deep.eq({price: 6, age: 2});

    });

});
