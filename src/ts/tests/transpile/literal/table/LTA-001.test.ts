import { testTranspile } from "../../../testUtil";

testTranspile("type inferred literal table", // a.k.a dictionary
`
def ().main
    let x =
        "name" = "John"
        "age"  = "Hello"
`,
`
function _main_(){
const $x = {
name" : "John",
age" : "Hello",
};
}
`);
