import { testTranspile } from "../../testUtil";

testTranspile("string indexing",
`
def (this List{T}).(that Integer) -> T
    pass

def (this String).(that Integer) -> String
    pass

def ().main 
    let x = "Hello".(0)
`,
`
function _$period_ListOfGeneric$T_Integer($this,$that){
$$pass$$();
}

function _$period_String_Integer($this,$that){
$$pass$$();
}

function _main_(){
const $x = _$period_String_Integer(
"Hello"
,(0));
}
`);
