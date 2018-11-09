import { testExecute } from "../../../testUtil";

testExecute({
description: "generic bifunc", // This is necessary for implementing array indexing functions
input: 
`
def this:T:list . index:number  -> :T
    <javascript>
    return $this[$index]
    </javascript>

def .Main
    let x = [1,2,3,4]
    x. 0 .log

`,
expectedOutput: "1"
})