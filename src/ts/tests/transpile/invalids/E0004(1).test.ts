import { testError } from "../../testUtil";

testError("ErrorExtraMember", `
def People
    'name String
    'age  Number

def .main
    let x = People
        'name = "Wong"
        'age  = 88
        'wife = "Jane"
`);
