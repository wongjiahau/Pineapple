import { expect } from "chai";
import { pine2js } from "../../../pine2js";
import { catchError } from "../../testUtil";

describe("E0003(1)", () => {
    it("duplicated members", () => {
        const input =
`
def People
    'name String

def .main
    let x = People
        'name = "123"
        'name = "123"
`;
        expect(catchError(() => pine2js(input)).name).to.eq("ErrorDuplicatedMember");
    });

});
