import { testError } from "../../testUtil";

testError("ErrorIncorrectTypeGivenForVariable", `
def .main
    let x Number = "abc"
`);
