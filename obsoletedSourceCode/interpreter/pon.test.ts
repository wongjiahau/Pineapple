import { expect } from "chai";
import { interpret } from "../../repl";

describe("pineapple object notation", () => {
    it("singline, where first member dont have preceding space", () => {
        const input = "{.age=12 .brother={.name='john'}}";
        const result = interpret(input);
        expect(result).to.deep.eq({
            age: 12,
            brother: {
                name: "john"
            }
        });
    });

    it("singline, where first member has preceding space", () => {
        const input = "{ .age=12 .brother={ .name='john'}}";
        const result = interpret(input);
        expect(result).to.deep.eq({
            age: 12,
            brother: {
                name: "john"
            }
        });
    });

    it("multiline", () => {
        const input = `
let myFruit =
    .name = "Durian"
    .price = 100
    .sibiling =
        .price = 123
    .test = 1 + 1
`;
        interpret(input);
        const result = interpret("myFruit");
        expect(result).to.deep.eq({
            name: "Durian",
            price: 100,
            sibiling: {
                price: 123
            },
            test: 2
        });
    });

});
