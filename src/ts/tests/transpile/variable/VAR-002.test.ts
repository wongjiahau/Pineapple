import { testTranspile } from "../../testUtil";

testTranspile("nullable variable",
`
def Nil
    #nil

def .main
    let x Number? = #nil
`
,
`
function _main_(){
const $x = null;
}
`);
