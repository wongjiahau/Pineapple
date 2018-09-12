import { testTranspile } from "../../testUtil";

testTranspile("if else without elif",
`
def Boolean
    pass

def (this Number) > (that Number) -> Boolean
    pass

def ().main
    if 5 > 6
        return "ok"
    else
        return "no"
`,
`
function _$greaterThan_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
if(_$greaterThan_Number_Number((5),(6))){
return "ok";
}else {
return "no";
}
}
`);
