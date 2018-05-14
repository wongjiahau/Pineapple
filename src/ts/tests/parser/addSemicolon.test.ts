import { expect } from "chai";
import { addSemicolon } from "../../addSemicolon";

describe("addSemicolon", () => {
    it("should not add semicolon for partial object member assignment/binding", () => {
        const input =
`
let fruit =
    .name = "Pine"
        .sibiling =
            .name = "Durian"
let x = 5
`;
        const expected =
`
;let fruit =
    .name = "Pine"
        .sibiling =
            .name = "Durian"
;let x = 5
`;
        expect(addSemicolon(input)).to.eq(expected);

    });

});
