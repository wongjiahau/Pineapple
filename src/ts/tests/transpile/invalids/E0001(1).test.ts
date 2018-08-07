import { testError } from "../../testUtil";

testError("ErrorAccessingInexistentMember", `
def People
    'name String
    'age  Number

def .main
    let x = People
        'name = "Wong"
        'age  = 99

    let y = x'nam
`);
