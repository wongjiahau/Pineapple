import { testError } from "../../tests/testUtil";

testError("ErrorIncorrectTypeGivenForMember", `
def Node{T}
    :children List{T}

def ().main
    let x = Node{Number}
        :children = "hi"
`);
