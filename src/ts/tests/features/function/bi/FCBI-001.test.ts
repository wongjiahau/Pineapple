import { testExecute } from "../../../testUtil";

testExecute({
description: "bifunc",
input: 
`
def this:number.add that:number -> :number
    <javascript>
    return $this + $that;
    </javascript>

def .main
    1.add 2.add 3.log

`,
expectedOutput: "6"
}
)