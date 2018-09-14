import { testTranspile } from "../../testUtil";

testTranspile("case 1",
`
def (this List{T}).(that Number) -> T
    pass

def ().main
    let x = [1, 2, 3]
    let y = x.(0)
`,
`
function _$period_ListOfGeneric$T_Number($this,$that){
$$pass$$();
}

function _$period_ListOfInteger_Number($this,$that){
$$pass$$();
}

function _main_(){
const $x = [(1),(2),(3)];
const $y = _$period_ListOfInteger_Number($x,(0));
}
`);
