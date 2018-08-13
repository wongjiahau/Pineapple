import { testError } from "../../tests/testUtil";

testError("ErrorNonVoidExprNotAssignedToVariable",
`def (this String).reverse -> String
    pass

def .main
    "hello".reverse
`);
