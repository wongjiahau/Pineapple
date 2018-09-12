import { testTranspile } from "../../../testUtil";

testTranspile("bifunc", 
`
def (this Number).add(that Number) -> Number
    pass

def ().main
    let result = 1.add(2)
`,
`
function _add_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
const $result = _add_Number_Number((1),(2));
}
`)