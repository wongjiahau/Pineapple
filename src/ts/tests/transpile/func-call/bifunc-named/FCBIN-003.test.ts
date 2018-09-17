import { testTranspile } from "../../../testUtil";

testTranspile("generic binary function",
`
def (this List{T}) ++ (that List{T}) -> List{T}
    pass

def (this List{T}).append(that T) -> List{T}
    return this ++ [that]
`,
`
function _$plus$plus_ListOfGeneric$T_ListOfGeneric$T($this,$that){
$$pass$$();
}

function _append_ListOfGeneric$T_Generic$T($this,$that){
return _$plus$plus_ListOfGeneric$T_ListOfGeneric$T(
$this
,[$that]);
}
`);
