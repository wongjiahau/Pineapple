import { testTranspile } from "../../../testUtil";

testTranspile("bodyless object",
`
def People
    pass

def .main
    let x = People
    let y = 6
`,
`

`)