import { testTranspile } from "../../../testUtil";

testTranspile("void bifunc",
`
def (this Number).squeeze(that Number)
    pass
`
,
`
function _squeeze_Number_Number($this,$that){
$$pass$$();
}
`);
