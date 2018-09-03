import { testError } from "../../tests/testUtil";

testError("ErrorMissingMember", `
def People
    :name String
    :age  Number

def .main
    let x = new People
        :name = "Wong"
`);
