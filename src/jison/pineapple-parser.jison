/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
("+"|"-")             return 'BINOP1'
("*"|"/")             return 'BINOP2'
("%"|"^")             return 'BINOP3'
"("                   return '('
")"                   return ')'
"PI"                  return 'PI'
"E"                   return 'E'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */
/* the last statement has the highest precedence */
/* the first statement has the lower precedence */

%left BINOP1
%left BINOP2
%left BINOP3
%left UMINUS

%start expressions

%% /* language grammar */

binary_operator
    : BINOP1
    | BINOP2
    | BINOP3
    ;

expressions
    : e EOF
        { // typeof console !== 'undefined' ? console.log($1) : print($1);
          return $1; 
        }
    ;

e
    : e BINOP1 e {$$={
        kind     : "BinaryOperator",
        left     : $1,
        operator : $2,
        right    : $3
    }}

    | e BINOP2 e {$$={
        kind     : "BinaryOperator",
        left     : $1,
        operator : $2,
        right    : $3
    }}

    | e BINOP3 e {$$={
        kind     : "BinaryOperator",
        left     : $1,
        operator : $2,
        right    : $3
    }}

    | '-' e %prec UMINUS
        {$$ = -$2;}

    | '(' e ')'
        {$$ = $2;}

    | NUMBER {$$ = {
        kind: "Number",
        value: Number(yytext)
    }}
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    ;
