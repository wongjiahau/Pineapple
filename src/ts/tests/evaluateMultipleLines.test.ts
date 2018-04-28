import { expect } from "chai";
import {evaluateMultipleLines} from "../repl";

describe("evaluateMultipleLines", () => {
    it("parsing Pineapple Object Notation", () => {
        const input = `
myFruit =
    .name = "Durian"
    .price = 100
    .sibiling =
        .name = "Rambutan"
    .test = 1 + 1 * 0
`;
        const result = evaluateMultipleLines(input.split("\n"));
        expect(result[0]).to.deep.eq({
            name: "Durian",
            price: 100,
            sibiling: {
                name: "Rambutan"
            },
            test: 1
        });
    });
});
