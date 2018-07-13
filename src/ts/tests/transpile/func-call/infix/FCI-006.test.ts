import { expect } from "chai";
import { pine2js } from "../../../../pine2js";

describe("FCI-006", () => {
    it("parent type inference", () => {
        const input =
`
def (this Array) (++) (that Array) -> Array
    pass

def main:
    let result = [0] ++ [1]
    result = [1] ++ result
`;
        const expectedOutput =
`
function main(){
    const result = new ArrayOfNumber([(0)])._$plus$plus_Array()
}
`;
        // console.log(pine2js(input));
        // console.log(expectedOutput);
        expect(pine2js(input).trim()).to.eq(expectedOutput.trim());
    });

});
