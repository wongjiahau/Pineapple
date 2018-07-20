import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("@branch-BRA-001", () => {
    it("if", () => {
        const input =
`
def (this Number) > (that Number) -> Boolean
    pass

def .main
    let x Number = 4
    let y Number = 6
    if x > y
        if y > x
            let a = "yes"
    elif y > x
        let b = "no"
    else
        let c = "oops"
`;
        const expectedOutput =
`
function _$greaterThan_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
const $x = (4);
const $y = (6);
if(_$greaterThan_Number_Number($x,$y)){
if(_$greaterThan_Number_Number($y,$x)){
const $a = "yes"
}
}else if(_$greaterThan_Number_Number($y,$x)){
const $b = "no"
}else {
const $c = "oops"
};
}
`;

        const result = pine2js(input);
        assertEquals(result.trim(), expectedOutput.trim());
    });

});
