import { testExecute } from "../../testUtil";

testExecute({
description: "generic thing",
input:
`
def thing :T:node
    .value :T
    .next  :T:node?

def .Main
    let x = :integer:node
        .value = 11
        .next  = :integer:node
            .value = 22
            .next  = #nil
    
    x.value.Log
    x.next.value.Log
`,
expectedOutput: "11 22"
}
);
