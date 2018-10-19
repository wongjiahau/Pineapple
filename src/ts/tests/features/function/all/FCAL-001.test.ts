import { testExecute } from "../../../testUtil";

testExecute({
description: "bifunc",
input: 
`
def this:number.square -> :number
    return this * this

def this:number * that:number -> :number
    <javascript>
    return $this * $that;
    </javascript>

def this:number.isBetween x:number and y:number -> :boolean
    <javascript>
    return $this >= $x && $this <= $y;
    </javascript>

def .main
    3.square * 4 .isBetween 35 and 37.log

`,
expectedOutput: "true"
}
)