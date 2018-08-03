import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("x0005", () => {
    it("generic type checking", () => {
        const input =
`
def .main
    let x = [1,2,3].append("1")

def (this List{T}).append(that T) -> List{T}
    pass
`;
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorNoConformingFunction");
    });

});
