import { testExecute } from "../../../testUtil";

testExecute({
description: "prefix operator",
input: 
`
def - this:number -> :number
    <javascript>
    return - $this;
    </javascript>

def .main
    -99.log
`,
expectedOutput: "-99"
}
)