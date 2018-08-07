import { testError } from "../../testUtil";

testError("ErrorVariableRedeclare", `
def .main
    let myName String = "123"
    let myName String = "123"
`);
