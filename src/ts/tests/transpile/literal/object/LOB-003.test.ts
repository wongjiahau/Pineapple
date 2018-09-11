import { testTranspile } from "../../../testUtil";

testTranspile("object literals with member key",
`
def People
    :name   String
    :age    Number

def .main
    let people = People
        :name  = "john"
        :age   = 123
`,
`
function _main_(){
const $people = {
$kind: "People",
name : "john",
age : (123),
};
}
`)
