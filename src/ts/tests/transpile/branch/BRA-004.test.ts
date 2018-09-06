import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("BRA-004", () => {
    it("and operator", () => {
        const input =
`
def Boolean
    pass

def (this Number) > (that Number) -> Boolean
    pass

def .main
    if 5 > 6 and 6 > 7
        return "ok"
`;
        const expectedOutput =
`
function _$greaterThan_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
if(((_$greaterThan_Number_Number((5),(6))) && _$greaterThan_Number_Number((6),(7)))){
return "ok"
};
}

`.trim();

        const result = pine2js(input).trim();
        assertEquals(result, expectedOutput);
    });

});
