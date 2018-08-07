import { testError } from "../../testUtil";

testError("ErrorUnmatchingReturnType", `
def .pi -> Number
    return "3.142"
`);
