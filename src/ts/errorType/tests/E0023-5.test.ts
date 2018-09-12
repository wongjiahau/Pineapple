import { testError } from "../../tests/testUtil";

testError("ErrorUsingUndefinedType", `
def Peopl
    pass
def ().main
    let x = People
        :name = "Wong"
        :age  = 99

    let y = x:name
`);
