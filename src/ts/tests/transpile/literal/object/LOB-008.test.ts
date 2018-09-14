import { testTranspile } from "../../../testUtil";

testTranspile("generic struct",
`
def Tree{T}
    :children List{T}

def ().main
    let x = Tree{Integer}
        :children = [1,2,3]
`,
`
function _main_(){
const $x = {
$kind: "TreeOfInteger",
children : [(1),(2),(3)],
};
}
`);
