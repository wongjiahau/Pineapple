import { testTranspile } from "../../testUtil";

testTranspile("generic struct",
`
def Node{T}
    :current T
    :next    Node{Node{T}}
`
,
``); // noth ing will be transpiled, just to make sure it passes the parser
