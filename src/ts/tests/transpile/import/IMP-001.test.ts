import { testTranspile } from "../../testUtil";

testTranspile("import",
`
import "Hello"
`,
`
`)
