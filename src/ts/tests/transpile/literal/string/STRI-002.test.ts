import { testTranspile } from "../../../testUtil";

testTranspile("string interpolation with nested brackets",
`
def .main
    let x = 123
    let z = "Hello $((x)) world $(x)" 
`,
`

function _main_(){
const $x = (123);
const $z = "Hello " + $x + " world " + $x + "";
}

`);