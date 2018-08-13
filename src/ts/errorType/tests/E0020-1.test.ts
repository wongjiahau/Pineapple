import { testError } from "../../tests/testUtil";

testError("ErrorUsingUndefinedEnum",
`
def .main
    let x = \`red
`);
