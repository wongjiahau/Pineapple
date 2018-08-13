import { testError } from "../../tests/testUtil";

testError("ErrorForExprNotArray",
`
def .main
    for i in 99
        i.show
`);
