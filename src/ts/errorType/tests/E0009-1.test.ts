import { testError } from "../../tests/testUtil";

testError("ErrorStructRedeclare", `
def Person
    'name String

def Person
    'name String
`);
