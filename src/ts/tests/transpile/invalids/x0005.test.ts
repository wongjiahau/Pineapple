import { expect } from "chai";
import { pine2js } from "../../../pine2js";

describe("x0005", () => {
    it("generic type checking", () => {
        const input =
`
def .main
    let x = [1,2,3].append("1")
    
def (this T[]).append(that T) -> T[]
    pass
`;
        expect(() => pine2js(input)).to.throws();
    });

});
