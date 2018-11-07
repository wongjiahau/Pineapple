
import { testExecute } from "../../../testUtil";

testExecute({
description: "4 parameters function",
input: 
`
def this:string.Replace from:integer To end:integer With new:string -> :string
    <javascript>
    const s = $this;
    return s.substring(0, $from) + $new + s.substring($end);
    </javascript>

def .Main
    "Hello world".Replace 0 To 5 With "Bye" .Log

`,
expectedOutput: "Bye world"
}
)