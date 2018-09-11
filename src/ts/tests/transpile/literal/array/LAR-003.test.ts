import { testTranspile } from "../../../testUtil";

testTranspile("empty array",
`
def .main
    let x = List{String}
`,
`
function _main_(){
const $x = [];
}
`)
