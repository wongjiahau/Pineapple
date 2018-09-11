import { testTranspile } from "../../testUtil";

testTranspile("should ignore consequtive newlines",
`
def (this String).show
    <javascript>
    console.log($this.valueOf());
    </javascript>


def (this String).say
    <javascript>
    console.log($this.valueOf());
    </javascript>

`
,
`
function _show_String($this){
// <javascript>
console.log($this.valueOf());
// </javascript>
}

function _say_String($this){
// <javascript>
console.log($this.valueOf());
// </javascript>
}


`);
