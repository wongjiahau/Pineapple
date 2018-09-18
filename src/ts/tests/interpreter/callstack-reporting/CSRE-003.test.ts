import { testError, testRuntimeError } from "../../testUtil";

testRuntimeError("handling calling passed function",
`
def ().main
    ().hello

def ().hello
    pass
`,

  { name: 'ErrorStackTrace',
      errorType: 'Not implemented error',
      stack:
       [ { first_line: 6,
           last_line: 6,
           first_column: 4,
           last_column: 8,
           callingFile: '<UNIT_TEST>',
           lineContent: '    pass',
           insideWhichFunction: '.hello' },
         { first_line: 3,
           last_line: 3,
           first_column: 6,
           last_column: 12,
           callingFile: '<UNIT_TEST>',
           lineContent: '    ().hello',
           insideWhichFunction: '.main' } ] }



);
