import { testTranspile } from "../../../testUtil";

testTranspile("double symbols",
`
def (this String) ++ (that String) -> String
    pass

def ().main
    let y = "pine" ++ "apple"
`,
`
function _$plus$plus_String_String($this,$that){
$$pass$$();
}

function _main_(){
const $y = _$plus$plus_String_String(
"pine"
,"apple");
}
`);
