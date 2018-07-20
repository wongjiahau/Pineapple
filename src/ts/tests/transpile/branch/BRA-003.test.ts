import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("BRA-003", () => {
    it("if else without elif", () => {
        const input =
`
def (this Number) > (that Number) -> Boolean
    pass

def .main
    if 5 > 6
        return "ok"
    else
        return "no"
`;
        const expectedOutput =
`
function _$greaterThan_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
if(_$greaterThan_Number_Number((5),(6))){
return "ok"
}else {
return "no"
};
}

`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
