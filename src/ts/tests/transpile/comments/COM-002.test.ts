import { testTranspile } from "../../testUtil";

testTranspile("behind the line comments",
`
def .main
    let x = 3 // hello
`,
`
function _main_(){
const $x = (3);
}
`)