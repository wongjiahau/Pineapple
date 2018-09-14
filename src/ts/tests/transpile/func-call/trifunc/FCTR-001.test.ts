import { testTranspile } from "../../../testUtil";

testTranspile("trifunc",
`
def (this String).replace(old String with that String) -> String
    pass

def ().main
    let x = "1,2,3".replace("," with ".")
`,
`
function _replace_with_String_String_String($this,$old,$that){
$$pass$$();
}

function _main_(){
const $x = _replace_with_String_String_String("1,2,3",",",".");
}
`);
