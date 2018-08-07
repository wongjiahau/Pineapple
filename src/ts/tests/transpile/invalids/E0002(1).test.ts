import { testError } from "../../testUtil";

testError("ErrorAssigningToImmutableVariable", `
def .main
    let x = 12
    x = 5
`);
