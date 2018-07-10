import { expect } from "chai";
import { smoothify } from "../../smoothify";

describe("smoothify", () => {
    it("should add space for object declaration", () => {
        const input = "{.age=123 .bro={.name='hey'}}";
        const expected = "{ .age=123 .bro={ .name='hey'}}";
        expect(smoothify(input)).to.eq(expected);
    });

    it("should replace linebreak with space", () => {
        const input = `
let myFruit =
    .name="Pinapple"`;
        const expected = ' let myFruit =     .name="Pinapple"';
        expect(smoothify(input)).to.eq(expected);

    });

});
