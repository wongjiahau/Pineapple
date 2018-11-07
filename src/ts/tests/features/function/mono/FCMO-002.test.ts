import { testExecute } from "../../../testUtil";

testExecute({
description: "prefix operator",
input: 
`
def - this:number -> :number
    <javascript>
    return - $this;
    </javascript>

def .Main
    -99.Log
`,
expectedOutput: "-99"
}
)