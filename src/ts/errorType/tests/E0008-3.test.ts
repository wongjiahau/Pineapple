import { testError } from "../../tests/testUtil";

testError("ErrorNoConformingFunction", `
def ().main
    let x = [1,2,3].append("1")

def (this List{T}).append(that T) -> List{T}
    pass
`);
