import { testTranspile } from "../../../testUtil";

testTranspile("case 1",
`
def (this String).show
    pass

def ().main
    "hello world".show
`,
`
function _show_String($this){
$$pass$$();
}

function _main_(){
_show_String("hello world");
}

`)