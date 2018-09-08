import { testError } from "../../tests/testUtil";

testError("ErrorInvalidIndentation",
`
def .main
   let x = "123"
`);
