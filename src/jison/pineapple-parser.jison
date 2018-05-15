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
    kind: "Boolean",
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

const BindingNode = (varname, dataType, expr) => ({
    kind: "Binding",
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

const ObjectMemberNode = (name, expr, next, dataType, type) => ({ 
    kind: "ObjectMember",
    name: name,
    type: type,
    dataType: dataType,
    expression: expr,
    next: next,
});

const ObjectAccessNode = (name, expr) => ({
    kind: "ObjectAccess",
    name: name,
    accessProperty: expr
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

const ArraySlicingNode = (expr, start, end, excludeUpperBound=false) => ({
    kind: "ArraySlicing",
    expr: expr,
    start: start,
    end: end,
    excludeUpperBound: excludeUpperBound
});


const CompoundStatement = (statement, nextStatment) => ({
    kind: "CompoundStatement",
    current: statement,
    next: nextStatment,
});


const IfStatement = (condition, body, elsePart) => ({
    kind: "If",
    condition: condition,
    body: body,
    else: elsePart
});

%}

/* lexical grammar */
%lex
%%

"let "                          return 'LET'
"if "                           return 'IF'
"elif "                         return 'ELIF'
"else "                         return 'ELSE'
\s+"."[a-zA-Z]+[a-zA-Z0-9]*       return 'MEMBERNAME'                        
\s+                             /* skip whitespace */
("'"|"\"")([^\"\\]|[\\[n\"\']])*?("'"|"\"")  return 'STRING'
"true"                          return 'TRUE'
"false"                         return 'FALSE'
"null"                          return 'NULL'
[0-9]+("."[0-9]+)?\b            return 'NUMBER'
[a-zA-Z]+[a-zA-Z0-9]*           return 'VARNAME'                        
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
"="                             return 'BINDINGOP'
"!"                             return 'NOT'
("*"|"/")                       return 'BINOP2'
("%"|"^")                       return 'BINOP3'
".(.."                          return '.(..'
"..)"                           return '..)'
".("                            return '.('
"("                             return '('
")"                             return ')'
"{"                             return '{'
"}"                             return '}'
"["                             return '['
"]"                             return ']'
"|"                             return '|'
","                             return ','
"..<"                           return '..<'
".."                            return '..'
"."                             return 'DOT'
";"                             return ';'
<<EOF>>                         return 'EOF'

/lex

/* operator associations and precedence */
/* the last statement has the highest precedence */
/* the first statement has the lower precedence */

%right ASSIGNOP
%right ':'
%left ',' DOT
%left LT GT LTE GTE EQ NEQ NOT
%left '+' '-'
%left BINOP2
%left BINOP3
%left UMINUS

%start entry_point

%% /* language grammar */

entry_point
    : statement_list EOF {return $1}
    ;

statement_list
    : statement ';' statement_list {$$=CompoundStatement($1,$3)}
    | statement {$$=CompoundStatement($1, null)}
    ;

statement
    : assignment_statement  
    | binding_statement    
    | if_statement
    | compound_statement
    | expression
    ;

compound_statement
    : '{' statement_list '}' { $$=$2 }
    ;

if_statement
    : IF expression compound_statement elif_statement
    | IF expression compound_statement {$$=IfStatement($2,$3,null)}
    ;

elif_statement
    : ELIF expression compound_statement elif_statement
    | ELSE compound_statement
    ;

expression
    : arithmetic_expression
    | '(' expression ')' {$$ = $2;}
    | relational_expression
    | value
    | object_access
    | array_slicing
    ;

value
    : NULL {$$=NullNode()}
    | bool_value {$$=BooleanNode(yytext)}
    | STRING {$$=StringNode(yytext)}
    | object
    | array
    ;

array
    : '[' elements ']' {$$=ArrayNode($2)}
    | '[' ']' {$$=ArrayNode(null)}
    ;

bool_value
    : TRUE 
    | FALSE
    ;

elements
    : expression {$$=ElementNode($1, null)}
    | expression ',' elements {$$=ElementNode($1, $3)}
    ;

assignment_statement
    : LET VARNAME ASSIGNOP expression {$$=AssignmentNode(VariableNode($2),null,$4)}
    | LET VARNAME ':' VARNAME ASSIGNOP expression {$$=AssignmentNode(VariableNode($2),$4,$6)}
    | VARNAME ASSIGNOP expression {$$=AssignmentNode(VariableNode($1), null, $3)}
    ;

binding_statement
    : LET VARNAME BINDINGOP expression {$$=BindingNode(VariableNode($2),null,$4)}
    | LET VARNAME ':' VARNAME BINDINGOP expression {$$=BindingNode(VariableNode($2),$4,$6)}
    ;

object 
    :  '{' '}' {$$=ObjectNode(null)}
    |  '{' member '}' {$$=ObjectNode($2)}
    ;

member
    : MEMBERNAME ASSIGNOP expression         {$$=ObjectMemberNode($1,$3,null,null,"assignment")}
    | MEMBERNAME ASSIGNOP expression member  {$$=ObjectMemberNode($1,$3,$4,  null,"assignment")}
    | MEMBERNAME BINDINGOP expression        {$$=ObjectMemberNode($1,$3,null,null,"binding")}
    | MEMBERNAME BINDINGOP expression member {$$=ObjectMemberNode($1,$3,$4,  null,"binding")}
    ;

object_access
    : VARNAME DOT object_access {$$=ObjectAccessNode($1,$3)}
    | VARNAME DOT VARNAME {$$=ObjectAccessNode($1,(ObjectAccessNode($3,null)))}
    ; 

relational_expression
    : arithmetic_expression relational_operator arithmetic_expression {$$=BinaryOperatorNode($1,$2,$3)}
    ;

relational_operator : GT | LT | GTE | LTE | EQ | NEQ ;

arithmetic_expression
    : '-' arithmetic_expression %prec UMINUS {$$=UnaryOperatorNode($1,$2)}
    | '+' arithmetic_expression %prec UMINUS {$$=UnaryOperatorNode($1,$2)}
    | arithmetic_expression '+' arithmetic_expression    {$$=BinaryOperatorNode($1,$2,$3)}
    | arithmetic_expression '-' arithmetic_expression    {$$=BinaryOperatorNode($1,$2,$3)}
    | arithmetic_expression BINOP2 arithmetic_expression {$$=BinaryOperatorNode($1,$2,$3)}
    | arithmetic_expression BINOP3 arithmetic_expression {$$=BinaryOperatorNode($1,$2,$3)}
    | NUMBER {$$=NumberNode(yytext)}
    | maybe_arithmetic_value
    ;

maybe_arithmetic_value
    : VARNAME {$$=VariableNode($1)}
    ;

array_slicing
    : expression '.(..' expression ')' {$$=ArraySlicingNode($1,NumberNode(0),$3)}
    | expression '.(' expression '..)' {$$=ArraySlicingNode($1,$3,NumberNode(-1))}
    | expression '.(' expression '..' expression ')' {$$=ArraySlicingNode($1,$3,$5)}
    | expression '.(' expression '..<' expression ')' {$$=ArraySlicingNode($1,$3,$5,true)}
    ;