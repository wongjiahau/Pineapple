import { testTranspile } from "../../../testUtil";

testTranspile("function call multiline chaining",`
def (this Number).double -> Number
    pass

def (this Number).plus(that Number) -> Number
    pass

def (this Number).isBetween(left Number and right Number) -> Number
    pass

def ().main
    let result = 9
        .double
        .plus(77)
        .isBetween(3 and 5)
`
,
`
function _double_Number($this){
$$pass$$();
}

function _plus_Number_Number($this,$that){
$$pass$$();
}

function _isBetween$and_Number_Number_Number($this,$left,$right){
$$pass$$();
}

function _main_(){
const $result = _isBetween$and_Number_Number_Number(
_plus_Number_Number(
_double_Number(
(9))
,(77))
,(3)
,(5));
}
`)