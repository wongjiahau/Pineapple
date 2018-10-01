import { testTranspile } from "../../testUtil";

testTranspile("group", 
`
def group Expression

def (this T).print -> String
    if T is Expression

def Constant
    :value String

def Constant is Expression

def (this Constant).print
    return this:value

def Addition
    :left   Expression
    :right  Expression

def Addition is Expression

def (this Addition).print
    return this:left.print ++ "+" ++ this:right.print

`,
`
`) 