import { testError } from "../../tests/testUtil";

testError("ErrorAssigningToImmutableVariable", `
def .main
    let x = 12
    x = 5
`);
