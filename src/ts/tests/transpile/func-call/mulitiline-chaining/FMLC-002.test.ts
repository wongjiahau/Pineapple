import { testTranspile } from "../../../testUtil";

testTranspile("function call multiline chaining",`
def Boolean
    #true
    #false

def Color
    :red    Integer
    :green  Integer
    :blue   Integer

def (this Integer) == (that Integer) -> Boolean
    pass

def  (this Boolean).and(that Boolean) -> Boolean
    pass

def (this Color) == (that Color) -> Boolean
    return  (this:red   == that:red)
        .and(this:green == that:green)
        .and(this:blue  == that:blue)
`
,
`

function _$equal$equal_Integer_Integer($this,$that){
$$pass$$();
}

function _$equal$equal_Color_Color($this,$that){
return _and_Boolean_Boolean(
_and_Boolean_Boolean(
_$equal$equal_Integer_Integer(
$this.red
,$that.red)
,_$equal$equal_Integer_Integer(
$this.green
,$that.green))
,_$equal$equal_Integer_Integer(
$this.blue
,$that.blue));
}

function _and_Boolean_Boolean($this,$that){
$$pass$$();
}


`)