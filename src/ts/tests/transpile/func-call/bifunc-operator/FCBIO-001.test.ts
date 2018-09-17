import { testTranspile } from "../../../testUtil";

testTranspile("bifunction call",
`
def (this Number) + (that Number) -> Number
    pass

def ().main
    let x Number = 4
    let y Number = 6
    let result = x + y
`,
`
function _$plus_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
const $x = (4);
const $y = (6);
const $result = _$plus_Number_Number(
$x
,$y);
}
`);
