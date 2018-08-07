import { testError } from "../../tests/testUtil";

testError("ErrorIncorrectTypeGivenForVariable", `
def .main
    let x Number = "abc"
`);
