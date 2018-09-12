import { testTranspile } from "../../../testUtil";

testTranspile("string interpolation",
`
def ().main
    let message1 = "baby"
    let message2 = "123"
    let z = "Hello $(message1) baby $(message2) world"
`,
`

function _main_(){
const $message1 = "baby";
const $message2 = "123";
const $z = "Hello " + $message1 + " baby " + $message2 + " world";
}
`);
