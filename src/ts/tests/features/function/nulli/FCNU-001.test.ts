import { testExecute } from "../../../testUtil";

testExecute({ 
description: "nulli func",

input:
`
def .Main
    "Hello world".Log
`,

expectedOutput: `Hello world`
});