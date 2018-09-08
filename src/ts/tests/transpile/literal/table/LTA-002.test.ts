import { testTranspile } from "../../../testUtil";

testTranspile("Empty table", // a.k.a dictionary
`
def .main
    let x = Table{String, String}
`,
`
function _main_(){
const $x = {};
}
`);
