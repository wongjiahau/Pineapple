import { testTranspile } from "../../testUtil";

testTranspile("import single file",
`
import "samplePineScripts/a"

def ().main
    let x = "Hello world"
`,
`
function _show_String($this){
$$pass$$();
}


function _hello_(){
_show_String(
"Hello world");
}


function _main_(){
const $x = "Hello world";
}

`);
