import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("IMP-001", () => {
    it("case 1", () => {
        const input =
`
import "Hello"
`;
        const expectedOutput =
`
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });
});
