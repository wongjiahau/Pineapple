import { testTranspile } from "../../testUtil";

testTranspile("array slicing", 
`
def (this List{T}).(start Integer to end Integer) -> T
    pass

def ().main
    let x = [1, 2, 3]
    let y = x.(0 to 1)
`,
`
function _$period_to_ListOfGeneric$T_Integer_Integer($this,$start,$end){
$$pass$$();
}

function _$period_to_ListOfInteger_Integer_Integer($this,$start,$end){
$$pass$$();
}

function _main_(){
const $x = [(1),(2),(3)];
const $y = _$period_to_ListOfInteger_Integer_Integer($x,(0),(1));
}
`)
