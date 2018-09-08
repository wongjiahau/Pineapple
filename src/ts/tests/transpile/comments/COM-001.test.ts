import { testTranspile } from "../../testUtil";

testTranspile("simple comments",
`
// hello world
def .main
    let x = 3
`,
`
function _main_(){
const $x = (3);
}
`)