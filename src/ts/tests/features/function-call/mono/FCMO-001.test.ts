import { testExecute } from "../../../testUtil";

testExecute({
description: "monofunc",
input: 
`
def this:number.square -> :number
    <javascript>
    return $this * $this;
    </javascript>

def .main
    9.square.log
`,
expectedOutput: "81"
}
)