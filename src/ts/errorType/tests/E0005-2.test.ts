import { testError } from "../../tests/testUtil";

testError("ErrorIncorrectTypeGivenForMember", `
def Node{T}
    :current T

def .main
    let x = new Node{Number}
        :current = 123
`, true);
