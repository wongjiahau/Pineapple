import { testTranspileSkip } from "../../testUtil";

testTranspileSkip("variable optimization",
// since x is used again, need to copy
`
def ().main
    let x = 5
    let y = x
    let z = x
`,

`

`);
