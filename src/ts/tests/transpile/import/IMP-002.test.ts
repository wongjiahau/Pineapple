import { testTranspile } from "../../testUtil";

testTranspile("import every file from a directory",
`
import "samplePineScripts/innerDir/*"

def ().main
    ().cFunc
    ().dFunc
`,
`
function _dFunc_(){
$$pass$$();
}

function _cFunc_(){
$$pass$$();
}

function _main_(){
_cFunc_();
_dFunc_();
}
`)
