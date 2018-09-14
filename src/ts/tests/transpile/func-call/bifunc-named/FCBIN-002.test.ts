import { testTranspile } from "../../../testUtil";

testTranspile("named functions has higher precedence than operator function",
`
def (this Number).mul(that Number) -> Number
    pass

def (this Number) + (that Number) -> Number
    pass

def ().main
    let result = 1.mul(2) + 3.mul(6)
`,
`
function _mul_Number_Number($this,$that){
$$pass$$();
}

function _$plus_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
const $result = _$plus_Number_Number(_mul_Number_Number((1),(2)),_mul_Number_Number((3),(6)));
}
`);
