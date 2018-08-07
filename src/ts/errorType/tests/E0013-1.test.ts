import { testError } from "../../tests/testUtil";

testError("ErrorUsingUnknownFunction", `
def .main
    let x = 1.plus(2)
`);
