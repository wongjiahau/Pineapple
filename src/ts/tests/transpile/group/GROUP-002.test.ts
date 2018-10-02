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
`) 