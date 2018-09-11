import { testTranspile } from "../../../testUtil";

testTranspile("should find for more specific type if possible",
`
def (this Any).show
    pass

def (this String).show
    pass

def .main
    "Hello".show
`,
`
function _show_Any($this){
$$pass$$();
}

function _show_String($this){
$$pass$$();
}

function _main_(){
_show_String("Hello");
}
`)
