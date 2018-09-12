import { testTranspile } from "../../testUtil";

testTranspile("should ignore consecutive newlines",
`
def ().main
    let x = "hello world"


`
,
`
function _main_(){
const $x = "hello world";
}
`)
