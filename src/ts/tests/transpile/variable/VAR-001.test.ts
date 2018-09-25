import { testTranspile } from "../../testUtil";

testTranspile("mutable variable",
`
def ().main
    let mutable x = 1
    x = 2
`,
`
function _main_(){
let $x = (1);
$x = (2);
}
`);
