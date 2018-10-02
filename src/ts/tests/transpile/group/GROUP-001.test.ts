import { testTranspile } from "../../testUtil";

testTranspile("group", 
`

def group Expression

def (this T).print -> String
    if T is Expression

def Constant
    :value String

def Constant is Expression

def (this Constant).print -> String
    return this:value

def Addition
    :left   Expression
    :right  Expression

def Addition is Expression

def (this Addition).print -> String
    return this:left.print ++ "+" ++ this:right.print

def (this String) ++ (that String) -> String
    pass
`,
`
$$GROUP$$["Expression"] = [];
$$GROUP$$["Expression"].push(_print_Constant)
$$GROUP$$["Expression"].push(_print_Addition)

function _print_Expression($this){
$$GROUP$$["Expression"][$$TYPEOF$$($this)]($this)
}

function _print_Constant($this){
return $this.value;
}

function _print_Addition($this){
return _$plus$plus_String_String(
_$plus$plus_String_String(
_print_Expression(
$this.left)
,"+")
,_print_Expression(
$this.right));
}

function _$plus$plus_String_String($this,$that){
$$pass$$();
}

`) 