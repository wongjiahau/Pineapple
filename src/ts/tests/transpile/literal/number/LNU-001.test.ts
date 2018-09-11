import { testTranspile } from "../../../testUtil";

testTranspile("every number should be surrounded by brackets",
`
def .main
    let x = 12345
`,
`function _main_(){
const $x = (12345);
}
`)
