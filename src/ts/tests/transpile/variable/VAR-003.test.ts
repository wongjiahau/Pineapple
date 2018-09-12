import { testTranspileSkip } from "../../testUtil";

testTranspileSkip("variable optimization",
// since x is not used anymore, no need to copy
`
def ().main
    let x = 5
    let y = x`,
`

`);
