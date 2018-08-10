import { testError } from "../../tests/testUtil";

testError("ErrorNoConformingFunction", `
def .main
    let x = 1.moreThan("1")

def (this T).moreThan(that T) -> List{T}
    pass
`);
