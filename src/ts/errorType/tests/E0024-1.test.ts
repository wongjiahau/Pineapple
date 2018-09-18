import { testError } from "../../tests/testUtil";

testError("ErrorListElementsArentHomogeneous",
`
def ().main
    let xs = [1,2,3,"4",5]
`);
