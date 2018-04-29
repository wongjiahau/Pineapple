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

const StringNode = (value) => ({
    kind: "String",
    value: eval(value)
});

const BooleanNode = (value) => ({
    kind: "Number",
    value: eval(value)
});

const NullNode = () => ({
    kind: "Null"
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


const ObjectNode = (member) => ({
    kind: "Object",
    memberNode: member
});

const ObjectMemberNode = (name, expr, next) => ({ 
    kind: "ObjectMember",
    name: name,
    expression: expr,
    next: next
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

\s+                             /* skip whitespace */
("'"|"\"")([^\"\\]|[\\[n\"\']])*("'"|"\"")  return 'STRING'
"true"                          return 'TRUE'
"false"                         return 'FALSE'
"null"                          return 'NULL'
[0-9]+("."[0-9]+)?\b            return 'NUMBER'
[a-zA-Z]+[a-zA-Z0-9]*           return 'VARNAME'                        
"."[a-zA-Z]+[a-zA-Z0-9]*        return 'MEMBERNAME'                        
"+"                             return '+'
"-"                             return '-'
":"                             return ':'
"\n"                            return '\n'
"\""                            return '"'                     
"<-"                            return 'ASSIGNOP'
">="                            return 'GTE'
"<="                            return 'LTE'
"<"                             return 'LT'
">"                             return 'GT'
"=="                            return 'EQ'
"!="                            return 'NEQ'
"!"                             return 'NOT'
("*"|"/")                       return 'BINOP2'
("%"|"^")                       return 'BINOP3'
"("                             return '('
")"                             return ')'
"{"                             return '{'
"}"                             return '}'
"["                             return '['
"]"                             return ']'
"|"                             return '|'
","                             return ','
"PI"                            return 'PI'
"E"                             return 'E'
<<EOF>>                         return 'EOF'

/lex

/* operator associations and precedence */
/* the last statement has the highest precedence */
/* the first statement has the lower precedence */

%right ASSIGNOP
%right ':'
%left ','
%left LT GT LTE GTE EQ NEQ NOT
%left '+' '-'
%left BINOP2
%left BINOP3
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : expr EOF         { return $1; }
    | partial_expr EOF { return $1; }
    ;

expr
    : arithmetic_expr
    | '(' expr ')' {$$ = $2;}
    | E {$$ = Math.E;}
    | PI {$$ = Math.PI;}
    | assignment_expr
    | '[' elements ']' {$$=ArrayNode($2)}
    | '[' ']' {$$=ArrayNode(null)}
    | relational_expr
    | value
    ;

value
    : NULL {$$=NullNode()}
    | bool_value {$$=BooleanNode(yytext)}
    | STRING {$$=StringNode(yytext)}
    | object
    ;

bool_value
    : TRUE 
    | FALSE
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
    :  '{' '}' {$$=ObjectNode(null)}
    |  '{' member '}' {$$=ObjectNode($2)}
    ;

member
    : MEMBERNAME ASSIGNOP expr {$$=ObjectMemberNode($1, $3, null)}
    | MEMBERNAME ASSIGNOP expr member {$$=ObjectMemberNode($1, $3, $4)}
    ;

partial_expr
    : partial_assignment
    | member
    ;

partial_assignment
    : VARNAME ASSIGNOP {$$=AssignmentNode(VariableNode($1),null,null)}
    | VARNAME ':' VARNAME ASSIGNOP {$$=AssignmentNode(VariableNode($1),$3,null)}
    | MEMBERNAME ASSIGNOP {$$=ObjectMemberNode($1, null, null)}
    ;

relational_expr
    : arithmetic_expr relational_operator arithmetic_expr {$$=BinaryOperatorNode($1,$2,$3)}
    ;

relational_operator : GT | LT | GTE | LTE | EQ | NEQ ;

arithmetic_expr
    : '-' arithmetic_expr %prec UMINUS {$$=UnaryOperatorNode($1,$2)}
    | '+' arithmetic_expr %prec UMINUS {$$=UnaryOperatorNode($1,$2)}
    | arithmetic_expr '+' arithmetic_expr    {$$=BinaryOperatorNode($1,$2,$3)}
    | arithmetic_expr '-' arithmetic_expr    {$$=BinaryOperatorNode($1,$2,$3)}
    | arithmetic_expr BINOP2 arithmetic_expr {$$=BinaryOperatorNode($1,$2,$3)}
    | arithmetic_expr BINOP3 arithmetic_expr {$$=BinaryOperatorNode($1,$2,$3)}
    | NUMBER {$$=NumberNode(yytext)}
    | maybe_arithmetic_value
    ;

maybe_arithmetic_value
    : VARNAME {$$=VariableNode($1)}
    ;