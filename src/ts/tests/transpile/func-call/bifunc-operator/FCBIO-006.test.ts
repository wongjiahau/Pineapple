import { testTranspile } from "../../../testUtil";

testTranspile("generic type specialization",
`
def ().main
    let x = [1,2,3].append(1).append(3)

def (this List{T}).append(that T) -> List{T}
    pass
`,
`
function _main_(){
const $x = _append_ListOfGeneric$T_Generic$T(
_append_ListOfGeneric$T_Generic$T(
[(1),(2),(3)]
,(1))
,(3));
}

function _append_ListOfGeneric$T_Generic$T($this,$that){
$$pass$$();
}
`);
