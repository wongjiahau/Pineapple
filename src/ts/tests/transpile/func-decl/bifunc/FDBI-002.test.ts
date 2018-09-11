import { testTranspile } from "../../../testUtil";

testTranspile("double equals",
`
def (x Number) == (y Number) -> Number
    pass
`
,
`
function _$equal$equal_Number_Number($x,$y){
$$pass$$();
}
`)
