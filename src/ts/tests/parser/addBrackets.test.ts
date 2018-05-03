import { expect } from "chai";
import { addBrackets } from "../../addBrackets";

describe("addBrackets", () => {
    it("case 1", () => {
        const input = `
myFruit =
    .name = "Durian"
    .price = 100
    .sibiling =
        .name = "Rambutan"
    .test = 1 + 1 * 0
`;

        const expected = `
myFruit ={
    .name = "Durian"
    .price = 100
    .sibiling ={
        .name = "Rambutan"}
    .test = 1 + 1 * 0}
`;
        const result = addBrackets(input);
        expect(result).to.eq(expected);
    });

    it("case 2", () => {
        const input =
`myFruit =
    .name = "Pine"

x = 5`;

        const expected =
`myFruit ={
    .name = "Pine"}

x = 5`;
        const result = addBrackets(input);
        expect(result).to.eq(expected);
    });
});
