/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"+"                   return '+'
"-"                   return '-'
("*"|"/")             return 'BINOP2'
("%"|"^")             return 'BINOP3'
">"                   return 'UMINUS'
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

%left '+' '-'
%left BINOP2
%left BINOP3
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : expr EOF { 
        return $1; 
    }
    ;

expr
    : '-' expr %prec UMINUS {$$={
        kind: "UnaryOperator",
        operator: $1,
        inner: $2,
    }}

    | '+' expr %prec UMINUS {$$={
        kind: "UnaryOperator",
        operator: $1,
        inner: $2,
    }}

    | expr '+' expr {$$={
        kind     : "BinaryOperator",
        left     : $1,
        operator : $2,
        right    : $3
    }}
    
    | expr '-' expr {$$={
        kind     : "BinaryOperator",
        left     : $1,
        operator : $2,
        right    : $3
    }}

    | expr BINOP2 expr {$$={
        kind     : "BinaryOperator",
        left     : $1,
        operator : $2,
        right    : $3
    }}

    | expr BINOP3 expr {$$={
        kind     : "BinaryOperator",
        left     : $1,
        operator : $2,
        right    : $3
    }}

    | UMINUS expr {$$={
        kind: "UnaryOperator",
        operator: '-',
        inner: $2,
    }}

    | '(' expr ')'
        {$$ = $2;}

    | NUMBER {$$={
        kind: "Number",
        value: Number(yytext)
    }}

    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    ;
