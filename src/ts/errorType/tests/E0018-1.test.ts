import { testError } from "../../tests/testUtil";

testError("ErrorAssigningToUndefinedVariable",
`
def ().main
    x = 5
`);
