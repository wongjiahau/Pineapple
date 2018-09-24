import { testTranspile } from "../../testUtil";

testTranspile("singleline example",
`
example 1 -> 2
`
,
` 
$$examples$$.push(function(){$$handleExample$$((1),(2),"<UNIT_TEST>",{"first_line":2,"last_line":2,"first_column":8,"last_column":22});
});

`)