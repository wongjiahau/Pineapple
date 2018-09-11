import { testTranspile } from "../../testUtil";

testTranspile("for loop 1",
`
def (this String).print
    pass

def .main
    for i in ["a", "b", "c"]
        i.print
`,
`
function _print_String($this){
$$pass$$();
}

function _main_(){
const itemsOfi = ["a","b","c"];
for(let i = 0; i < itemsOfi.length; i++){
const $i = itemsOfi[i];
_print_String($i);
}
}
`)
