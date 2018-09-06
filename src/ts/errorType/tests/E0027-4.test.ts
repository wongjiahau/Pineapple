import { testError } from "../../tests/testUtil";

testError("ErrorMissingClosingBracket",
`
def .main
    let x = "baby"
    let y = "hello $(x $(x)"
`);
