/* description: Parses and executes mathematical expressions. */
%{
const BinaryOperatorNode = (left, operator, right) => ({
    kind: "BinaryOperator",
    left: left,
    operator: operator,
    right: right,
});

const UnaryOperatorNode = (operator, inner) => ({
    kind: "UnaryOperator",
    operator: operator,
    inner: inner
});

const NumberNode = (value) => ({
    kind: "Number",
    value: Number(value)
});

const AssignmentNode = (varname, dataType, expr) => ({
    kind: "Assignment",
    variableNode: varname,
    dataType: dataType,
    expression: expr
});

const VariableNode = (varname) => ({
    kind: "VariableName",
    name: varname
});

const MemberNode = (memberName, expr) => ({
    kind: "ObjectChild",
    name: memberName,
    expression: expr
});

const ArrayNode = (element) => ({
    kind: "ArrayNode",
    element: element
});

const ElementNode = (expr, next) =>  ({
    kind: "Element",
    expression: expr,
    next: next
});
%}

/* lexical grammar */
%lex
%%

\s+                      /* skip whitespace */
[0-9]+("."[0-9]+)?\b     return 'NUMBER'
[a-zA-Z]+[a-zA-Z0-9]*    return 'VARNAME'                        
"."[a-zA-Z]+[a-zA-Z0-9]* return 'MEMBERNAME'                        
"+"                      return '+'
"-"                      return '-'
":"                      return ':'
"="                      return 'ASSIGNOP'
("*"|"/")                return 'BINOP2'
("%"|"^")                return 'BINOP3'
"("                      return '('
")"                      return ')'
"{"                      return '{'
"}"                      return '}'
"["                      return '['
"]"                      return ']'
","                      return ','
"PI"                     return 'PI'
"E"                      return 'E'
<<EOF>>                  return 'EOF'
.                        return 'INVALID'

/lex

/* operator associations and precedence */
/* the last statement has the highest precedence */
/* the first statement has the lower precedence */

%right ASSIGNOP
%right ':'
%left ','
%left '+' '-'
%left BINOP2
%left BINOP3
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : expr EOF { return $1; }
    ;

expr
    : '-' expr %prec UMINUS {$$=UnaryOperatorNode($1,$2)}

    | '+' expr %prec UMINUS {$$=UnaryOperatorNode($1,$2)}

    | expr '+' expr    {$$=BinaryOperatorNode($1,$2,$3)}

    | expr '-' expr    {$$=BinaryOperatorNode($1,$2,$3)}

    | expr BINOP2 expr {$$=BinaryOperatorNode($1,$2,$3)}

    | expr BINOP3 expr {$$=BinaryOperatorNode($1,$2,$3)}
    
    | '(' expr ')' {$$ = $2;}

    | NUMBER {$$=NumberNode(yytext)}

    | VARNAME {$$=VariableNode($1)}

    | E {$$ = Math.E;}

    | PI {$$ = Math.PI;}

    | assignment_expr

    | '[' elements ']' {$$=ArrayNode($2)}
    | '[' ']' {$$=ArrayNode(null)}

    ;

elements
    : expr {$$=ElementNode($1, null)}
    | expr ',' elements {$$=ElementNode($1, $3)}
    ;

assignment_expr
    : VARNAME ASSIGNOP expr {$$=AssignmentNode(VariableNode($1),null,$3)}
    | VARNAME ':' VARNAME ASSIGNOP expr {$$=AssignmentNode(VariableNode($1),$3,$5)}
    ;

object 
    : '{' '}'
    | '{' members '}'
    ;

members
    : pair
    | pair ',' members
    ;

pair
    :MEMBERNAME ASSIGNOP expr
    ;
