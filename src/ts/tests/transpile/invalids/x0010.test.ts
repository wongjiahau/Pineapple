import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("x0010", () => {
    it("incorrect member type", () => {
        const input =
`
def People
    'name String
    'age  Number

def .main
    let x = People
        'name = "Wong"
        'age  = "eighty"
`;
        // 'age member should take Number instead of String
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorIncorrectTypeGivenForMember");
    });

});
