import { testTranspileSkip } from "../../../testUtil";

testTranspileSkip("bodyless object",
`
def People
    pass

def ().main
    let x = People
    let y = 6
`,
`

`);
