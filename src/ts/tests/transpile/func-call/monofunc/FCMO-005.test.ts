import { testTranspile } from "../../../testUtil";

testTranspile("generic monofunc", 
`
def (this T).show
    pass

def ().main
    "Hello".show
`,
`
function _show_Generic$T($this){
$$pass$$();
}

function _show_String($this){
$$pass$$();
}

function _main_(){
_show_String("Hello");
}
`);
