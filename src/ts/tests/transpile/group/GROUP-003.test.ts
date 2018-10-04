import { testTranspile } from "../../testUtil";

testTranspile("group inheritance", 
`
def group SyntaxNode

def group Expression

def Expression is SyntaxNode

def (this T).toJS -> String
    if T is SyntaxNode

def Addition
    :left   Number
    :right  Number

def Addition is Expression

def (this Addition).toJS -> String
    pass

def Constant
    :value Number

def Constant is SyntaxNode

def (this Constant).toJS -> String
    pass

`,
`
$$GROUP$$["SyntaxNode"] = {};
$$GROUP$$["SyntaxNode"]["Addition"]=(_toJS_Addition)
$$GROUP$$["SyntaxNode"]["Constant"]=(_toJS_Constant)

$$GROUP$$["Expression"] = {};
$$GROUP$$["Expression"]["Addition"]=(_toJS_Addition)

function _toJS_SyntaxNode($this){
return $$GROUP$$["SyntaxNode"][$$typeof$$($this)]($this)
}

function _toJS_Addition($this){
$$pass$$();
}

function _toJS_Constant($this){
$$pass$$();
}
`) 