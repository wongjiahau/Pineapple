import { testTranspile } from "../../testUtil";

testTranspile("ensurance",
`
def Boolean
    pass

def (this Number) > (that Number) -> Boolean
    pass

def ().main
    ensure 1 > 2`,
`
function _$greaterThan_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
$$ensure$$(_$greaterThan_Number_Number(
(1)
,(2)))
}

`);