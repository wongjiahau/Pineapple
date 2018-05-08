import { expect } from "chai";
import { interpret } from "../../repl";

describe("pineapple object notation", () => {
    it("case 1", () => {
        const input = `
let myFruit =
    .name = "Durian"
    .price = 100
    .sibiling =
        .price = 123
    .test = 1 + 1 * 0
`;
        interpret(input);
        const result = interpret("myFruit");
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
