import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("x0002", () => {
    it("using unknown named-infix function", () => {
        const input =
`def main:
    let x = 1 plus: 2
`;
        const expected =
`
ERROR >>> You cannot call the function 'plus:' as it does not exist.

          | 1 | def main:
ERROR >>> | 2 |     let x = 1 plus: 2
          | 3 |

The error is located at line 2, column 12.

For more information, Google search PINER_USUF.
`;
        const result = pine2js(input);
        // console.log(result.trim());
        // console.log(expected.trim());
        expect(result.trim()).to.eq(expected.trim());
    });
});
