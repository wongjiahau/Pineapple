import { testExecute } from "../../../testUtil";

testExecute({
description: "monofunc",
input: 
`
def this:number.Square -> :number
    <javascript>
    return $this * $this;
    </javascript>

def .Main
    9.Square.Log
`,
expectedOutput: "81"
}
)