import { testTranspile } from "../../testUtil";

testTranspile("import single file",
`
import "samplePineScripts/a"

def ().main
    let x = "Hello world"
`,
`


`);
