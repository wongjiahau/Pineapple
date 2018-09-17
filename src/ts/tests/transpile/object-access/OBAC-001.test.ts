import { testTranspile } from "../../testUtil";

testTranspile("object access",
`
def People
    :name String
    :age  Number

def ().main
    let x = People
        :name = "Wong"
        :age  = 99

    let y = x:name
    y.show

def (this String).show
    pass
`
,
`
function _main_(){
const $x = {
$kind: "People",
name : "Wong",
age : (99),
};
const $y = $x.name;
_show_String(
$y);
}

function _show_String($this){
$$pass$$();
}
`);
