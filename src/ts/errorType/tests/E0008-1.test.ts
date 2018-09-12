import { testError } from "../../tests/testUtil";

testError("ErrorNoConformingFunction", `
def (this String).print
    pass

def ().main
    123.print
`);
