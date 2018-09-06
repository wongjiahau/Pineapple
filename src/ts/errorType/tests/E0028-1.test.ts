import { testError } from "../../tests/testUtil";

testError("ErrorLexical", `
def .main
    let x = "12
`);
