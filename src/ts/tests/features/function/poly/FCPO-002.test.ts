
import { testExecute } from "../../../testUtil";

testExecute({
description: "4 parameters function",
input: 
`
def this:string.replace from:integer to end:integer with new:string -> :string
    <javascript>
    const s = $this;
    return s.substring(0, $from) + $new + s.substring($end);
    </javascript>

def .main
    "Hello world".replace 0 to 5 with "Bye" .log

`,
expectedOutput: "Bye world"
}
)