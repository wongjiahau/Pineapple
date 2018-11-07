import { testExecute } from "../../testUtil";

testExecute({
description: "thing",
input:
`
def thing :person
    .name   :string
    .age    :integer

def .Main
    let me = :person
        .name = "Wong"
        .age = 99

    me.name.Log
    me.age.Log
`,
expectedOutput: `Wong 99`
}
);
