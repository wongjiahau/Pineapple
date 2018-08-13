import { testError } from "../../tests/testUtil";

testError("ErrorEnumRedeclare", `
def Color
    \`red

def Color
    \`red
`);
