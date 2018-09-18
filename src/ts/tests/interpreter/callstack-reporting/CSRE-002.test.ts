import { testError, testRuntimeError } from "../../testUtil";

testRuntimeError("handling ensurance failed",
`
def Boolean
    pass

def (this Number) == (that Number) -> Boolean
    <javascript>
    return $this === $that;
    </javascript>

def ().main
    ensure 1 == 2
`,

    { name: 'ErrorStackTrace',
      errorType: 'Ensurance Failed',
      stack:
       [ { first_line: 11,
           last_line: 11,
           first_column: 11,
           last_column: 17,
           callingFile: '<UNIT_TEST>',
           lineContent: '    ensure 1 == 2',
           insideWhichFunction: '.main' } ] }


);
