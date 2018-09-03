import { testError } from "../../tests/testUtil";

testError("ErrorUsingUndefinedGenericName",
`
def Node{T}
    :current Node{Node{T1}}
`
);
