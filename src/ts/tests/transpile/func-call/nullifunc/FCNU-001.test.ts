import { testTranspile } from "../../../testUtil";

testTranspile("nullifunc invocation",
`
def .main
    let x = .pi

def .pi -> Number
    pass
`
,
`
function _main_(){
const $x = _pi_();
}

function _pi_(){
$$pass$$();
}
`)
