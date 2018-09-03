import { TokenLocation } from "../../ast";
import { labelLineNumbers } from "../../labelLineNumbers";
import { assertEquals, mockChalk } from "../testUtil";

describe("label line numbers", () => {
    it("case 1", () => {
        const input =
`
def .main
    "Hello world".show
"bye".show
    "bye".show
`.trim();
        const location: TokenLocation = {
                first_line: 3,
                last_line: 3,
                first_column: 0,
                last_column: 5
        };
        const result = labelLineNumbers(input, location, 3, mockChalk());
        const expected =
`
            | 1 | def .main
            | 2 |     "Hello world".show
    ERROR >>| 3 | "bye".show
            |   | ^^^^^
            | 4 |     "bye".show
`;
        assertEquals(result.trim(), expected.trim());
    });

    it("case 2", () => {
        const input =
`
    print: "1"
    print: "2"
    print: "3"
    print: "4"
    print: "5"
    print: "6"
    print: "7"
    print: "8"
    print: "9"
    print: "10"
    print: "11"
    print: "12"
    print: "13"
    print: "14"
`.trim();
        const location: TokenLocation = {
                first_line: 11,
                last_line: 11,
                first_column: 4,
                last_column: 9
        };
        const result = labelLineNumbers(input, location, 5, mockChalk());
        const expected =
`
            |  7 |     print: "7"
            |  8 |     print: "8"
            |  9 |     print: "9"
            | 10 |     print: "10"
    ERROR >>| 11 |     print: "11"
            |    |     ^^^^^
            | 12 |     print: "12"
            | 13 |     print: "13"
            | 14 |     print: "14"

`.trim();
        assertEquals(result, expected);
    });

});
