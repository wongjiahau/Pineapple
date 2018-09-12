import { testTranspile } from "../../../testUtil";

// should automatically add async keyword if the function contains any expression
// that calls an async function
testTranspile("async function",
`
def async ().readline -> String
    pass

def ().main
    let x = ().readline
`,
`
async function _readline_(){
$$pass$$();
}

async function _main_(){
const $x = (await _readline_());
}
`);
