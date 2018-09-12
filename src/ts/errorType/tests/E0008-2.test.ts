import { testError } from "../../tests/testUtil";

testError("ErrorNoConformingFunction", `
def (this String).concat(that String) -> String
    pass

def ().main
    let x = "123".concat(234)
`);
