import { testError } from "../../tests/testUtil";

testError("ErrorUsingUndefinedVariable",
`
def ().main
    let coco = 3
    let coca = 4
    let x = coc
`);
