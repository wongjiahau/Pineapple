import { testTranspile } from "../../testUtil";

testTranspile("multiline example",
`
def (this Integer) + (that Integer) -> Integer
    pass

example "+"
    let x = 1
    let y = 2
    let result = 3
    x + y -> result
`
,
`
function _$plus_Integer_Integer($this,$that){
$$pass$$();
}

$$examples$$.push(function(){const $x = (1);
const $y = (2);
const $result = (3);
$$handleExample$$(_$plus_Integer_Integer(
$x
,$y),$result,"<UNIT_TEST>",{"first_line":9,"last_line":9,"first_column":4,"last_column":27});
});

`)