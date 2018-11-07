import { testExecute } from "../../../testUtil";

testExecute({
description: "bifunc",
input: 
`
def this:number.Square -> :number
    return this * this

def this:number * that:number -> :number
    <javascript>
    return $this * $that;
    </javascript>

def this:number.IsBetween x:number And y:number -> :boolean
    <javascript>
    return $this >= $x && $this <= $y;
    </javascript>

def .Main
    3.Square * 4 .IsBetween 35 And 37.Log

`,
expectedOutput: "true"
}
)