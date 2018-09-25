import { testTranspile } from "../../testUtil";

testTranspile("while loop 1",
`
def Boolean
    pass

def (this Number) < (that Number) -> Boolean
    pass

def (this Number) + (that Number) -> Number
    pass

def ().main
    let mutable x = 0.0
    while x < 10.0
        x = x + 1
`
,
`
function _$lessThan_Number_Number($this,$that){
$$pass$$();
}

function _$plus_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
let $x = (0.0);
while(_$lessThan_Number_Number(
$x
,(10.0))){
$x = _$plus_Number_Number(
$x
,(1));
}
}
`);
