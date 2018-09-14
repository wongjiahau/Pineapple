import { testTranspile } from "../../../testUtil";

testTranspile("multiple type hierarchy",
`
def (this Number) + (that Number) -> Number
    pass

def (this Integer) + (that Integer) -> Integer
    pass

def ().main
    let x = 1 + 2.0
    let y = 1 + 2
`,
`
function _$plus_Number_Number($this,$that){
$$pass$$();
}

function _$plus_Integer_Integer($this,$that){
$$pass$$();
}

function _main_(){
const $x = _$plus_Number_Number((1),(2.0));
const $y = _$plus_Integer_Integer((1),(2));
}
`);
