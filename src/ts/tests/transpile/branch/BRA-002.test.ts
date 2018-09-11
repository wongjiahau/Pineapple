import { testTranspile } from "../../testUtil";

testTranspile("if elif elif else",
`
def Boolean
    pass

def (this Number) > (that Number) -> Boolean
    pass

def .main
    if 1 > 2
        let a = "no"
    elif 2 > 3
        let b = "no"
    elif 3 > 4
        let c = "no"
    else
        let d = "oops"
`,
`
function _$greaterThan_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
if(_$greaterThan_Number_Number((1),(2))){
const $a = "no";
}else if(_$greaterThan_Number_Number((2),(3))){
const $b = "no";
}else if(_$greaterThan_Number_Number((3),(4))){
const $c = "no";
}else {
const $d = "oops";
}
}
`)
