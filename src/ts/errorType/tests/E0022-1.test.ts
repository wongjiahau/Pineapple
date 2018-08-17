import { testError } from "../../tests/testUtil";

testError("ErrorAssigningNullToUnnullableVariable",
`
def Nil
    \`nil

def .main
    let x Number = \`nil
`
);
