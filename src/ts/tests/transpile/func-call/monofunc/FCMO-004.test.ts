import { testTranspile } from "../../../testUtil";

testTranspile("chaining multiple monofunc",
`
def (this String).capitalize -> String
    pass

def (this String).reverse
    pass

def ().main
    "Hello".capitalize.reverse
`,
`
function _capitalize_String($this){
$$pass$$();
}

function _reverse_String($this){
$$pass$$();
}

function _main_(){
_reverse_String(_capitalize_String("Hello"));
}
`)
