import { testError } from "../../tests/testUtil";

testError("ErrorNoConformingFunction", `
def ().main
    let x = (1.0).show

def (this Integer).show
    pass
`);
