import { testTranspile } from "../../../testUtil";

testTranspile("tuple literal",
`
def ().main
    let tuple = (1, "2", 3)
`
,
`
function _main_(){
const $tuple = [(1),"2",(3)];
}
`
)
