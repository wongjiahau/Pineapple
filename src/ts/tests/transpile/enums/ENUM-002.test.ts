import { testTranspile } from "../../testUtil";

testTranspile("boolean/null/undefined literal will be optimized",
`
def Boolean
    #true
    #false

def Nil
    #nil

def Undefined
    #undefined

def .main
    let x = #true
    let y = #false
    let z = #nil
    let a = #undefined
`,
`function _main_(){
const $x = true;
const $y = false;
const $z = null;
const $a = undefined;
}
`);