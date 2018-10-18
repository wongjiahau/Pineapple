import { testExecute } from "../../../testUtil";

testExecute({
description: "operator bifunc",
input: 
`
def this:number ^ that:number -> :number
    <javascript>
    return Math.pow($this,$that);
    </javascript>

def .main
    4 ^ 3.log

`,
expectedOutput: "64"
}
)