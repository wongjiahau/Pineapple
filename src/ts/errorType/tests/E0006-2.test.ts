import { testError } from "../../tests/testUtil";

testError("ErrorIncorrectTypeGivenForVariable", `
def ().main
    let mutable x Number = 123
    x = "abc"
`);
