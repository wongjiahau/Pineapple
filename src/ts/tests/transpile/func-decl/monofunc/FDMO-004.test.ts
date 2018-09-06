import { testTranspile } from "../../../testUtil";

testTranspile("prefix unary operator", 
`
def - (this Number) -> Number
    pass
`,
`
function _$minus_Number($this){
$$pass$$();
}
`
);