import { testError } from "../../tests/testUtil";

testError("ErrorUsingUndefinedGenericName",
`
def Node{T}
    :current T
    :next    Node{T1}
`);
