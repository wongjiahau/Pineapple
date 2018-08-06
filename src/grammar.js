module.exports = grammar({

name: "pineapple",
extras: $ => [$.comment, /\s/],

/**
 * Convention:
 * 1) PascalCase for non-terminal symbol
 * 2) camelCase for terminal symbols with variations (such as string, number)
 * 3) UPPERCASE for terminal symbols without variations (e.g. keywords such as 'let')
 */
rules: {
// program
program: $ => seq(repeat1(choice(
    $.ImportDecl,
    $.StructDecl,
    $.FuncDecl,
)), "@EOF"),
ImportDecl: $ => seq(
    $.IMPORT, $.string, "@NEWLINE"
),
StructDecl: $ => seq(
    $.DEF, $.typename, "@NEWLINE", "@INDENT", repeat1(seq($.membername, $.TypeExpression)), "@DEDENT"
),
FuncDecl: $ => choice(
    // Nullifunc declaration
    seq($.DEF, $.funcname, $.ARROW, $.TypeExpression, $.Block),
    seq($.DEF, $.funcname, $.Block),

    // Monofunc declaration
    seq($.DEF, $.VarDecl, $.funcname, $.ARROW, $.TypeExpression, $.Block),
    seq($.DEF, $.VarDecl, $.funcname, $.Block),

    // Bifunc declaration
    seq($.DEF, $.VarDecl, $.funcname, $.VarDecl, $.ARROW, $.TypeExpression, $.Block),
    seq($.DEF, $.VarDecl, $.funcname, $.VarDecl, $.Block),
    seq($.DEF, $.VarDecl, $.operator, $.VarDecl, $.ARROW, $.TypeExpression, $.Block),
    seq($.DEF, $.VarDecl, $.operator, $.VarDecl, $.Block),

    // Trifunc declaration
    seq($.DEF, $.VarDecl, $.funcname, "(", $.VarDecl, $.subfuncname, $.VarDecl, ")", $.ARROW, $.TypeExpression, $.Block),
    seq($.DEF, $.VarDecl, $.funcname, "(", $.VarDecl, $.subfuncname, $.VarDecl, ")", $.Block),
),
Block: $ => choice(
    seq("@NEWLINE", "@INDENT", repeat1($.Statement), "@DEDENT"),
    seq("@NEWLINE", "@INDENT", $.javascriptSnippet, "@NEWLINE", "@DEDENT"),
    seq("@NEWLINE", "@INDENT", $.PASS, "@NEWLINE", "@DEDENT"),
),
Statement: $ => choice(
    // Variable initialization
    seq($.LET, $.VarDecl, "=", $.MultilineExpr),

    // Variable assignment
    seq($.variable, "=", $.MultilineExpr),

    // Return statement
    seq($.RETURN, $.SinglelineExpr, "@NEWLINE"),

    // For statement
    seq($.FOR, $.variable, $.IN, $.SinglelineExpr, $.Block),

    // While statement
    seq($.WHILE, $.Test, $.Block),

    // Returnless function call
    seq($.AtomicFuncCall, "@NEWLINE"),

    $.IfStatement
),
IfStatement: $ => seq(
    $.IF, $.Test, $.Block, repeat($.ElifStatement), optional($.ElseStatement)
),
ElifStatement: $ => seq(
    $.ELIF, $.Test, $.Block
),
ElseStatement: $ => seq(
    $.ELSE, $.Test, $.Block
),
Test: $ => prec.left(1, seq(
    optional($.NOT), $.SinglelineExpr, repeat(seq(choice($.AND, $.OR), $.Test))
)),
VarDecl: $ => choice(
    $.variable,
    seq($.variable, $.MUTABLE),
    seq($.variable, $.TypeExpression),
    seq($.variable, $.TypeExpression, $.MUTABLE),
    seq("(", $.variable, ")"),
    seq("(", $.variable, $.TypeExpression, ")"),
),
TypeExpression: $ => seq(
    $.AtomicTypeExpr, repeat("|", $.TypeExpression)
),
AtomicTypeExpr: $ => choice(
    seq($.typename, optional("?")),
    seq($.generictypename, optional("?")),
    seq($.typename, "{", repeat($.TypeExpression), "}", optional("?")),
),
MultilineExpr: $ => choice(
    $.MultilineObject,
    $.MultilineDictionary,
    $.MultilineList,
    $.SinglelineExpr, "@NEWLINE"
),
SinglelineExpr: $ => prec.left(1, choice(
    $.AtomicExpr,
    $.OperatorFuncCall
)),
OperatorFuncCall: $ => seq(
    $.AtomicExpr, repeat1($.operator, $.AtomicExpr)
),
AtomicFuncCall: $ => choice(
    $.NulliFuncCall,
    $.MonoFuncCall,
    $.BiFuncCall,
    $.TriFuncCall
),
NulliFuncCall: $ => seq(
    $.funcname
),
MonoFuncCall: $ => prec.left(1, seq(
    $.AtomicExpr, $.funcname
)),
BiFuncCall: $ => prec.left(1, seq(
    $.AtomicExpr, $.funcname, "(", $.SinglelineExpr, ")"
)),
TriFuncCall: $ => prec.left(1, seq(
    $.AtomicExpr, $.funcname, "(", $.SinglelineExpr, $.subfuncname, $.SinglelineExpr, ")"
)),
AtomicExpr: $ => choice(
    seq("(", $.SinglelineExpr, ")"),
    $.ObjectAccessExpr,
    $.SinglelineList,
    $.AtomicFuncCall,
    $.string,
    $.number,
    $.variable
),
ObjectAccessExpr: $ => seq(
    $.AtomicExpr, $.membername
),
MultilineObject: $ => seq(
    $.typename, "@NEWLINE", "@INDENT", repeat($.MultilineObjectKeyValue), "@DEDENT"
),
MultilineObjectKeyValue: $ => seq(
    $.membername, "=", $.MultilineExpr
),
MultilineDictionary: $ => seq(
    "@NEWLINE", "@INDENT", repeat1($.MultilineDictKeyValue), "@DEDENT"
),
MultilineDictKeyValue: $ => seq(
    $.string, "=", $.MultilineExpr
),
SinglelineList: $ => seq(
    "[", repeat($.AtomicExpr), "]",
),
MultilineList: $ => seq(
    "@NEWLINE", "@INDENT", repeat1(seq("o", $.SinglelineExpr, "@NEWLINE")), "@DEDENT"
),

// keywords
DEF:        $ => "def",
IMPORT:     $ => "import",
PASS:       $ => "pass",
RETURN:     $ => "return",
FOR:        $ => "for",
IN:         $ => "in",
WHILE:      $ => "while",
IF:         $ => "if",
ELIF:       $ => "elif",
ELSE:       $ => "else",
NOT:        $ => "not",
AND:        $ => "and",
OR:         $ => "or",
LET:        $ => "let",
MUTABLE:    $ => "mutable",

// literals
variable:           $ => /[a-zA-Z]+/,
typename:           $ => /[A-Z][a-zA-Z0-9]*/,
generictypename:    $ => /[T][123456789]?/,
number:             $ => /\d+/,
comment:            $ => /\/\/.*/,
string:             $ => /["].*?["]/,
javascriptSnippet:  $ => /\<javascript\>(.|[\s\S])*?\<\/javascript\>/,
funcname:           $ => /[.]([a-zA-Z][a-zA-Z0-9]*)?/,
subfuncname:        $ => /([a-zA-Z][a-zA-Z0-9]*)?[:]/,
membername:         $ => /['][a-z][a-zA-Z0-9]*/,
operator:           $ => /[-!$%^@&*+|~=`;<>?,.\/]+/,

// predefined symbols
ARROW:      $ => "->",

}
});