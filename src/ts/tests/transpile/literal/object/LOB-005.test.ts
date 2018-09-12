import { testTranspile } from "../../../testUtil";

testTranspile("return object directly",
`
def People
    :name String

def ().newPeople -> People
    return People
        :name = "John"
`,
`
function _newPeople_(){
return {
$kind: "People",
name : "John",
};
}
`)
