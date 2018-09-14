import { testTranspile } from "../../../testUtil";

testTranspile("function call type inference",
`
def (this Number) + (that Number) -> Number
    pass

def ().main
    let y = 6 + (6 + 6)
`,
`
function _$plus_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
const $y = _$plus_Number_Number((6),_$plus_Number_Number((6),(6)));
}
`);
