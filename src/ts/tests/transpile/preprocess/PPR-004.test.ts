import { testTranspile } from "../../testUtil";

testTranspile("should auto add missing newline at EOF", 
`def .main
    let y = 6`
,
`
function _main_(){
const $y = (6);
}
`);