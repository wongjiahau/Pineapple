import { testError } from "../../tests/testUtil";

testError("ErrorConditionIsNotBoolean",
`
def Boolean
    #true
    #false

def ().show
    pass

def ().main
    if ().show
        ().show
`);
