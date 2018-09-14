import { testTranspile } from "../../../testUtil";

testTranspile("javascript literal",
`
def (this String).print
    <javascript>
    console.log($this);
    </javascript>
`
,
`
function _print_String($this){
// <javascript>
console.log($this);
// </javascript>
}
`);
