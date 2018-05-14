import { expect } from "chai";
import { addBrackets } from "../../addBrackets";

describe("addBrackets", () => {
    it("pon 1", () => {
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

    it("pon 2", () => {
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

    it("if elif else", () => {
        const input =
`if condition
    name = "Pine"
elif condition
    name = "Hey"
else
    name = "Yo"`;

        const expected =
`if condition{
    name = "Pine"}
elif condition{
    name = "Hey"}
else{
    name = "Yo"}`;
        const result = addBrackets(input);
        expect(result).to.eq(expected);
    });
});
