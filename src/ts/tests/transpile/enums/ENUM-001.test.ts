import { testTranspile } from "../../testUtil";

testTranspile("enum declaration", 
`
def Color
    #red
    #green
    #blue

def ().main
    let x Color = #green
`,
`
function _main_(){
const $x = {$kind: "_EnumColor", $value: "green"};
}
`);