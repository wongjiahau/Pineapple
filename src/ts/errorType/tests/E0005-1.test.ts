import { testError } from "../../tests/testUtil";

testError("ErrorIncorrectTypeGivenForMember", `
def People
    :name String
    :age  Number

def .main
    let x = new People
        :name = "Wong"
        :age  = "eighty"
`);
