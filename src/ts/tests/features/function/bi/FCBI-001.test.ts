import { testExecute } from "../../../testUtil";

testExecute({
description: "bifunc",
input: 
`
def this:number.Add that:number -> :number
    <javascript>
    return $this + $that;
    </javascript>

def .Main
    1.Add 2.Add 3.Log

`,
expectedOutput: "6"
}
)