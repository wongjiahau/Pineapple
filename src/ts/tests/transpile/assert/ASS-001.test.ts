import { testTranspile } from "../../testUtil";

testTranspile("assertion",
`
def Boolean
    pass

def (this Number) > (that Number) -> Boolean
    pass

def .main
    assert 1 > 2`,
``);