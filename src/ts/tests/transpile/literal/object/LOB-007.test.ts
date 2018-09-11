import { testTranspile } from "../../../testUtil";

testTranspile("generic struct",
`
def Node{T}
    :current T

def .main
    let x = Node{Number}
        :current = 123
`,
`
function _main_(){
const $x = {
$kind: "NodeOfNumber",
current : (123),
};
}
`)
