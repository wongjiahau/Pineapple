import { testError } from "../../tests/testUtil";

testError("ErrorUsingUndefinedVariable",
`
def ().main
    let x = a
`);
