import { testError } from "../../tests/testUtil";

testError("ErrorExtraMember", `
def People
    :name String
    :age  Number

def .main
    let x = new People
        :name = "Wong"
        :age  = 88
        :wife = "Jane"
`);
