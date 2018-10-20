import { testExecute } from "../../testUtil";

testExecute({
description: "copy and update thing",
input:
`
def this:number + that:number -> :number
    <javascript>
    return $this + $that;
    </javascript>

def thing :person
    'name   :string
    'hobby  :string
    'age    :integer

def .main
    let me = :person
        'name   = "Wong"
        'hobby  = "Dota"
        'age    = 50

    let olderMe = me but
        'age    = me'age + 10
        'hobby  = "Tea"

    olderMe'name.log
    olderMe'age.log
    olderMe'hobby.log

    // Fields of me should remain the same
    me'name.log
    me'age.log
    me'hobby.log
`,
expectedOutput: "Wong 60 Tea Wong 50 Dota"
}
);
