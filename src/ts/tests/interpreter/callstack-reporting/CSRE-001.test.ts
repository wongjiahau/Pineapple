import { testError, testRuntimeError } from "../../testUtil";

testRuntimeError("handling error stack trace",
`
def ().main
    ().yo

def ().yo
    ().bye

def ().bye
    <javascript>
    throw new Error("Hello world");
    </javascript>
`,
{ name: 'ErrorStackTrace',
    stack:
    [ { first_line: 6,
        last_line: 6,
        first_column: 6,
        last_column: 10,
        callingFile: '<UNIT_TEST>',
        lineContent: '    ().bye' },
        { first_line: 3,
        last_line: 3,
        first_column: 6,
        last_column: 9,
        callingFile: '<UNIT_TEST>',
        lineContent: '    ().yo' } ] }
);
