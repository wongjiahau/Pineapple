import { testTranspile } from "../../../testUtil";

testTranspile("prefix unary operator function call",
`
def - (this Number) -> Number
    pass

def .main
    let x = -123

`,
`
function _$minus_Number($this){
$$pass$$();
}

function _main_(){
const $x = _$minus_Number((123));
}
`);
