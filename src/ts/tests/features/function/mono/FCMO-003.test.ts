import { testExecute } from "../../../testUtil";

testExecute({
description: "postfix operator",
input: 
`
def this:number ! -> :number
    <javascript>
    const factorial = (x) => {
        if(x <= 1) return 1;
        else return x * factorial(x - 1);
    };
    return factorial($this);
    </javascript>

def .Main
    5!.Log
`,
expectedOutput: "120"
}
)