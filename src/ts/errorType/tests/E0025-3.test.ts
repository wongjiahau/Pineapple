import { testError } from "../../tests/testUtil";

testError("ErrorUsingUndefinedGenericName",
`
def Node{T}
    :current T
    :next    Node{Node{T1}}
`, true);
