import { testTranspile } from "../../../testUtil";

testTranspile("object literals with string key",
`
def ().main
    let y = 6

    let people =
        "name"  = "john"
        "age"   = 123
        "wife"  =
            "name" = "Natelie"
            "age"  = 99
        "yo" = 123

    let x = 5
`,
`
function _main_(){
const $y = (6);
const $people = {
name" : "john",
age" : (123),
wife" : {
name" : "Natelie",
age" : (99),
},
yo" : (123),
};
const $x = (5);
}
`);
