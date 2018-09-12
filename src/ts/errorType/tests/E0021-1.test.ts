import { testError } from "../../tests/testUtil";

testError("ErrorAssigningVoidToVariable", `
def (this String).show
    pass

def ().main
    let x = "hello".show
`);
