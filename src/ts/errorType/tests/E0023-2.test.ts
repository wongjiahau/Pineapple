import { testError } from "../../tests/testUtil";

testError("ErrorUsingUndefinedType",
`
def People
    :name Strj
`
, false);
