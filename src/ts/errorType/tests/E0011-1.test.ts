import { testError } from "../../tests/testUtil";

testError("ErrorUnmatchingReturnType", `
def .pi -> Number
    return "3.142"
`);
