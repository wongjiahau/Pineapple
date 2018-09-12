import { testTranspile } from "../../testUtil";

testTranspile("mutable variable", 
`
def ().main
    let x mutable = 1
    x = 2
`,
`
function _main_(){
let $x = (1);
$x = (2);
}
`);