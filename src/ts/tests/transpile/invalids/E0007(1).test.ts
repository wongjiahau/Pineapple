import { testError } from "../../testUtil";

testError("ErrorMissingMember", `
def People
    'name String
    'age  Number

def .main
    let x = People
        'name = "Wong"
`);
