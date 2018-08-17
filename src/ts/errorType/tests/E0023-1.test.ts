import { testError } from "../../tests/testUtil";

testError("ErrorUsingUndefinedType",
`
def .main
    let x Numbe = 123
`
, true);
