import { testTranspile } from "../../../testUtil";

testTranspile("nested bifunction call",
`
def (this Number) + (that Number) -> Number
    pass

def .main
    let y = 6 + 7 + 8
`,
`
function _$plus_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
const $y = _$plus_Number_Number(_$plus_Number_Number((6),(7)),(8));
}
`)
