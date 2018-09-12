import { testError } from "../../tests/testUtil";

testError("ErrorSyntax", `
def ().main
    let x = "12"
    let y = "Hello $(x asd)"
`);
