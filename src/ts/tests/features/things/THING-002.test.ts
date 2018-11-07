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
    .name   :string
    .hobby  :string
    .age    :integer

def .Main
    let me = :person
        .name   = "Wong"
        .hobby  = "Dota"
        .age    = 50

    let olderMe = me with
        .age    = me.age + 10
        .hobby  = "Tea"

    olderMe.name.Log
    olderMe.age.Log
    olderMe.hobby.Log

    // Fields of me should remain the same
    me.name.Log
    me.age.Log
    me.hobby.Log
`,
expectedOutput: "Wong 60 Tea Wong 50 Dota"
}
);
