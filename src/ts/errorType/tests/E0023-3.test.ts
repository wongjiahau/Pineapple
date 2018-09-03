import { testError } from "../../tests/testUtil";

testError("ErrorUsingUndefinedType",
`
def Node{T}
    :current Node{XX{T}}
`
);
