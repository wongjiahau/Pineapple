import { testError } from "../../tests/testUtil";

testError("ErrorNoConformingFunction", `
def .main
    let x = [1] ++ "1"

def (this List{T}) ++ (that List{T}) -> List{T}
    pass
`);
