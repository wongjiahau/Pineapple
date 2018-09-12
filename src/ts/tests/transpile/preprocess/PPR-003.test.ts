import { testTranspile } from "../../testUtil";

testTranspile("should ignore dangling newlines",
`
def ().main
    let y = 6


    let x = 8
`
,
`
function _main_(){
const $y = (6);
const $x = (8);
}
`);
