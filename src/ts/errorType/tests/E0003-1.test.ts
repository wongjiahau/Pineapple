import { testError } from "../../tests/testUtil";

testError("ErrorDuplicatedMember", `
def People
    :name String

def .main
    let x = People
        :name = "123"
        :name = "123"
`);
