import { testExecute } from "../../../testUtil";

testExecute({ 
description: "nulli func",

input:
`
def .main
    "Hello world".log
`,

expectedOutput: `Hello world`
});