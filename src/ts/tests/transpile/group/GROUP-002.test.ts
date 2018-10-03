import { testTranspile } from "../../testUtil";

testTranspile("conflict handling", 
`
def group Expression

def (this T).print -> String
    if T is Expression

def group Statement

def (this T).print -> String
    if T is Statement
`,
`

$$GROUP$$["Expression"] = {};

$$GROUP$$["Statement"] = {};

function _print_Expression($this){
return $$GROUP$$["Expression"][$$typeof$$($this)]($this)
}

function _print_Statement($this){
return $$GROUP$$["Statement"][$$typeof$$($this)]($this)
}

`) 