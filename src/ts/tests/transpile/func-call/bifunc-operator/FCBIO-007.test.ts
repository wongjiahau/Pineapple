import { testTranspile } from "../../../testUtil";

testTranspile("recursive bifunc",
`
def (this List{T}) ++ (that List{T}) -> List{T}
    pass

def (this Integer).to(that Integer) -> List{Integer}
    return [0] ++ (1.to(that))
`,
`    
function _$plus$plus_ListOfGeneric$T_ListOfGeneric$T($this,$that){
$$pass$$();
}

function _to_Integer_Integer($this,$that){
return _$plus$plus_ListOfGeneric$T_ListOfGeneric$T(
[(0)]
,_to_Integer_Integer(
(1)
,$that));
}

`);
