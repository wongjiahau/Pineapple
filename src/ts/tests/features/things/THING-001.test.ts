import { testExecute } from "../../testUtil";

testExecute({
description: "thing",
input:
`
def thing :person
    'name   :string
    'age    :integer

def .main
    let me = :person
        'name = "Wong"
        'age = 99

    me'name.log
    me'age.log
`,
expectedOutput: `Wong 99`
}
);
