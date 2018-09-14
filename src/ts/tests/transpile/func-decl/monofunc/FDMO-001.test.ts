import { testTranspile } from "../../../testUtil";

testTranspile("monofunc 1",
`
def (this String).show
    pass
`
,
`
function _show_String($this){
$$pass$$();
}
`);
