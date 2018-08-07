import { testError } from "../../testUtil";

testError("ErrorSyntax", `
def .main
    let x = "12
`);
