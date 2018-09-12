import { testError } from "../../tests/testUtil";

testError("ErrorInterpolatedExpressionIsNotString",
`
def ().main
    let x = 1
    let y = "hello $(x)"
`);
