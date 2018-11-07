import { testExecute } from "../../../testUtil";

testExecute({
description: "operator bifunc",
input: 
`
def this:number ^ that:number -> :number
    <javascript>
    return Math.pow($this,$that);
    </javascript>

def .Main
    4 ^ 3.Log

`,
expectedOutput: "64"
}
)