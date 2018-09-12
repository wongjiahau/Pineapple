import { testTranspile } from "../../../testUtil";

testTranspile("order of function declaration should not matter",
`
def ().main
    "Hello".show

def (this String).show
    pass
`,
`
function _main_(){
_show_String("Hello");
}

function _show_String($this){
$$pass$$();
}
`)
