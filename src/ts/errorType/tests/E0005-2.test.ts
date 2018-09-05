import { testError } from "../../tests/testUtil";

testError("ErrorIncorrectTypeGivenForMember", `
def Node{T}
    :current T

def .main
    let x = Node{Number}
        :current = "hi"
`);
