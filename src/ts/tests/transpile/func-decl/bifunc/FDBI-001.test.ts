import { testTranspile } from "../../../testUtil";

testTranspile("symbolic bifunction declaration",
`
def (x Number) + (y Number) -> Number
    <javascript>
    return $x + $y;
    </javascript>
`
,
`
function _$plus_Number_Number($x,$y){
// <javascript>
return $x + $y;
// </javascript>
}
`);
