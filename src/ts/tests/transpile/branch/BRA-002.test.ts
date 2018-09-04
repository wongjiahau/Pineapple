import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("BRA-002", () => {
    it("if elif elif else", () => {
        const input =
`
def Boolean
    pass

def (this Number) > (that Number) -> Boolean
    pass

def .main
    if 1 > 2
        let a = "no"
    elif 2 > 3
        let b = "no"
    elif 3 > 4
        let c = "no"
    else
        let d = "oops"
`;
        const expectedOutput =
`
function _$greaterThan_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
if((_$greaterThan_Number_Number((1),(2)))){
const $a = "no"
}else if((_$greaterThan_Number_Number((2),(3)))){
const $b = "no"
}else if((_$greaterThan_Number_Number((3),(4)))){
const $c = "no"
}else {
const $d = "oops"
};
}
`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
