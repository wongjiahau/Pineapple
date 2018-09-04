import { pine2js } from "../../../pine2js";
import { assertEquals } from "../../testUtil";

describe("WLO-001", () => {
    it("while loop 1", () => {
        const input =
`
def Boolean
    pass

def (this Number) < (that Number) -> Boolean
    pass

def (this Number) + (that Number) -> Number
    pass

def .main
    let x mutable = 0.0
    while x < 10.0
        x = x + 1
`;
        const expectedOutput =
`
function _$lessThan_Number_Number($this,$that){
$$pass$$();
}

function _$plus_Number_Number($this,$that){
$$pass$$();
}

function _main_(){
let $x = (0.0);
while((_$lessThan_Number_Number($x,(10.0)))){
    $x = _$plus_Number_Number($x,(1))
}
;
}
`;
        assertEquals(pine2js(input).trim(), expectedOutput.trim());
    });

});
