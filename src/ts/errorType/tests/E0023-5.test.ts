import { testError } from "../../tests/testUtil";

testError("ErrorUsingUndefinedType", `
def Peopl
    pass 
def .main
    let x = new People
        :name = "Wong"
        :age  = 99

    let y = x:name
`);
