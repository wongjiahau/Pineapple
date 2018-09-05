import { testError } from "../../tests/testUtil";

testError("ErrorUsingUndefinedVariable",
`
// interpolated variable
def .main
    let message = "Hello $(name)"
`);
