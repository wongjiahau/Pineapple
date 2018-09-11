import { testTranspile } from "../../../testUtil";

testTranspile("list with some elements",
`
def .main
    let x = [1.1, 2.2, 3.3, 4.4]
`
,
`
function _main_(){
const $x = [(1.1),(2.2),(3.3),(4.4)];
}
`)
