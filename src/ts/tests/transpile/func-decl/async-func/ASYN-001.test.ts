import { testTranspile } from "../../../testUtil";

testTranspile("async function",
`
def async .readline -> String
    pass

def .main
    let x = .readline
`,
`
async function _readline_(){
$$pass$$();
}

function _main_(){
const $x = (await _readline_());
}
`);
