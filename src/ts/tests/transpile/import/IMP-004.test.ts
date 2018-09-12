import { testTranspileSkip } from "../../testUtil";

testTranspileSkip("importing file from github",
`
import "$github/wongjiahau/Pineapple/"

def ().main
    ().dummy
`,
`
function _dummy_(){
$$pass$$();
}

function _main_(){
_dummy_();
}

`)

let commment = `

git push --tags

API: 
https://api.github.com/repos/<user>/<repos>/git/refs/tags

Example:
https://api.github.com/repos/wongjiahau/Pineapple/git/refs/tags
`;