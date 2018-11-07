
import { testExecute } from "../../../testUtil";

testExecute({
description: "3 parameters function",
input: 
`
def this:string.Replace that:string With the:string -> :string
    <javascript>
    return $this.replace($that,$the)
    </javascript>

def .Main
    "Hello world".Replace "world" With "babe".Log

`,
expectedOutput: "Hello babe"
}
)