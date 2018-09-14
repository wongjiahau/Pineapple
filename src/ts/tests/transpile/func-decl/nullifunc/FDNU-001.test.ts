import { testTranspile } from "../../../testUtil";

testTranspile("nullifunc",
`
def ().main
    pass
`,
`
function _main_(){
$$pass$$();
}
`);
