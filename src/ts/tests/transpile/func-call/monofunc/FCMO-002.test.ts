import { testTranspile } from "../../../testUtil";

testTranspile("parent type inference",
`
def (this Any).show
    pass

def ().main
    "Hello".show
`,
`
function _show_Any($this){
$$pass$$();
}

function _main_(){
_show_Any("Hello");
}
`)
