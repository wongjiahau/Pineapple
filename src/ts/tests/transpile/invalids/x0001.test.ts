import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("x0001", () => {
    it("variable redeclaration", () => {
        const input =
`def main:
    let myName String = "123"
    let myName String = "123"
`;
        const expected =
`
ERROR >>> You cannot declare variable 'myName' again, because it is already declared at line 2.

          | 1 | def main:
          | 2 |     let myName String = "123"
ERROR >>> | 3 |     let myName String = "123"
          | 4 |

The error is located at line 3, column 8.

For more information, Google search PINER_VARE.

`;
        const result = pine2js(input);
        // console.log(result.trim());
        // console.log(expected.trim());
        expect(result.trim()).to.eq(expected.trim());
    });
});
