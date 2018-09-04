import { testError } from "../../tests/testUtil";

testError("ErrorConditionIsNotBoolean",
`
def .show
    pass

def .main
    if .show
        .show
`);