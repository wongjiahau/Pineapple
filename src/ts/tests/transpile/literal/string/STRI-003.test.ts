import { testTranspile } from "../../../testUtil";

testTranspile("string interpolation with nested brackets",
`
def (this Number) + (that Number) -> Number
    pass

def (this Number).toString -> String
    pass

def ().main
    let x = 123
    let z = "Hello $((1+2).toString) world"
`,
`
function _$plus_Number_Number($this,$that){
$$pass$$();
}

function _toString_Number($this){
$$pass$$();
}

function _main_(){
const $x = (123);
const $z = "Hello " + _toString_Number(
_$plus_Number_Number(
(1)
,(2))) + " world";
}

`);
