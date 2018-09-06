import { testTranspile } from "../../../testUtil";

testTranspile("void trifunc",
`
def (this String).replace(old String with new String)
    pass
`,
`
function _replace_with_String_String_String($this,$old,$new){
$$pass$$();
}
`);