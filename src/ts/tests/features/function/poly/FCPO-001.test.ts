
import { testExecute } from "../../../testUtil";

testExecute({
description: "3 parameters function",
input: 
`
def this:string.replace that:string with the:string -> :string
    <javascript>
    return $this.replace($that,$the)
    </javascript>

def .main
    "Hello world".replace "world" with "babe".log

`,
expectedOutput: "Hello babe"
}
)