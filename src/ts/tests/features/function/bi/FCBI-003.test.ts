import { testExecute } from "../../../testUtil";

testExecute({
description: "function whose name is only a dot", // This is necessary for implementing array indexing functions
input: 
`
def this:number . that:number -> :number
    <javascript>
    return $this * $that;
    </javascript>

def .Main
    2 . 3 . 4 .Log

`,
expectedOutput: "24"
})