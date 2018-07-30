import { expect } from "chai";
const fs = require("fs");
import { fullTranspile, loadFile, SourceCode } from "../../interpreter";

describe("interpreter", () => {
    it("case 1", () => {
        const file1content =
`
def (this Number) + (that Number) -> Number
    <javascript>
    return $this + $that;
    </javascript>
`;

        const file2content =
`
def .main
    let x = 1 + 1
`;

        const file1name = "temp.file1.pine";
        const file2name = "temp.file2.pine";
        // console.log("hello");
        // fs.writeFileSync(file1name, file1content);
        // fs.writeFileSync(file2name, file2content);
        // expect(fullTranspile(loadFile(file2name))).to.not.throw();
    });
});
