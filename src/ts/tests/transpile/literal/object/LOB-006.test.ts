import { testTranspile } from "../../../testUtil";

testTranspile("recursive struct",
`
def Nil
    #nil

def People
    :name   String
    :friend People?

def ().newPeople -> People
    return People
        :name = "John"
        :friend = People
            :name = "Jane"
            :friend = #nil
`,
`
function _newPeople_(){
return {
$kind: "People",
name : "John",
friend : {
$kind: "People",
name : "Jane",
friend : null,
},
};
}
`)
