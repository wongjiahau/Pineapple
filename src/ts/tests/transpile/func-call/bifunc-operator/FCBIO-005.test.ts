import { testTranspile } from "../../../testUtil";

// Note that the input is an invalid function in Pineapple
// This part is just to test the functionalit of recursive type inference
testTranspile("recursive type inference",
`
def (this Number) -- (that String) -> String
    return this -- (5 -- that)
`,
`
function _$minus$minus_Number_String($this,$that){
return _$minus$minus_Number_String(
$this
,_$minus$minus_Number_String(
(5)
,$that));
}
`);
