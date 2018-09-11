import { testTranspile } from "../../testUtil";

testTranspile("importing file from pinelib",
`
import "$/prelude/dummy.pine"

def .main
    .dummy
`,
`
function _dummy_(){
$$pass$$();
}

function _main_(){
_dummy_();
}

`)
