import { testTranspile } from "../../../testUtil";

testTranspile("multiline lists",
`
def .main
    let fruits =
        o "pineapple"
        o "apple"
        o "banana"
`
,
`
function _main_(){
const $fruits = ["pineapple","apple","banana"];
}
`)
