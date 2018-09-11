import { testTranspile } from "../../testUtil";

testTranspile("import",
`
import "samplePineScripts/a.pine"

def .main
    let x = "Hello world"
`,
`
function _show_String($this){
$$pass$$();
}

function _main_(){
_show_String("Hello world");
}

`)
