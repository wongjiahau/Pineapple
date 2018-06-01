
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

const ArrayAccessNode = (expr, indexExpr) => ({
    kind: "ArrayAccess",
    expr: expr,
    index: indexExpr,
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


const ElifStatement = (condition, body, elsePart) => ({
    kind: "Elif",
    condition: condition,
    body: body,
    else: elsePart
});

const ElseStatement = (body) => ({
    kind: "Else",
    body: body
});

const Node = (type, tokenId) => ({
    type: type,
    tokenId: tokenId
});

const InfixFuncCallNode = (left, operator, right) => ({
    left: left,
    operator: operator,
    right: right
});

%}


/* lexical grammar */
%lex
%%
\s+           /* skip whitespace */
"::"          return '::'
"["           return '['
"]"           return ']'
","           return ','
[0-9]+        return 'TOKEN_ID'
"OPERATOR"    return 'OPERATOR'
"EOF"         return 'EOF'
"LEFT_PAREN"  return 'LEFT_PAREN'
"RIGHT_PAREN" return 'RIGHT_PAREN'
"PREFIX_FUNCNAME"    return 'PREFIX_FUNCNAME'
"INFIX_FUNCNAME"     return 'INFIX_FUNCNAME'
"POSTFIX_FUNCNAME"   return 'POSTFIX_FUNCNAME'
"VARNAME"     return 'VARNAME'
"MEMBERNAME"  return 'MEMBERNAME'
"TYPENAME"    return 'TYPENAME'
"ASSIGN_OP"   return 'ASSIGNOP'
"BIND_OP"     return 'BIND_OP'
"UNION_OP"    return 'UNION_OP'
"INTERSECT_OP" return 'INTERSECT_OP'
"TYPE_OP"     return 'TYPE_OP'
"NEWLINE"     return 'NEWLINE'
"LET"         return 'LET'
"NIL"         return 'NIL'
"NUMBER"      return 'NUMBER' 
"STRING"      return 'STRING'
"TRUE"        return 'TRUE'
"FALSE"       return 'FALSE'
/lex

/* operator associations and precedence */
/* the last statement has the highest precedence */
/* the first statement has the lower precedence */

%right ASSIGN_OP BIND_OP TYPE_OP
%left ',' DOT
%left LT GT LTE GTE EQ NEQ NOT  
%left BINOP2 '+' '-'
%left UMINUS
%left '::' TOKEN_ID OPERATOR NUMBER

%start EntryPoint

%% /* language grammar */

EntryPoint
    : StatementList EOF {return $1}
    ;

StatementList
    : StatementList NEWLINE Statement
    | Statement 
    ;

Statement
    : LinkStatement
    ;

LinkStatement
    : LET VariableAtom LinkOperator Expression
    | LET VariableAtom TYPE_OP TypeExpression LinkOperator Expression
    ;

LinkOperator
    : BIND_OP
    | ASSIGN_OP
    ;

TypeExpressionList
    : TypeExpressionList ',' TypeExpression
    | TypeExpression
    ;

TypeExpression
    : TypenameAtom
    | TypenameAtom '[' ']'
    | TypenameAtom '[' Expression ']'
    | TypenameAtom '[' TypeExpressionList ']'
    | TypeExpression UNION_OP TypenameAtom
    | TypeExpression INTERSECT_OP TypenameAtom
    ;

Expression
    : FuncCall
    ;

FuncCall
    : InfixFuncCall
    | PrefixFuncCall
    | PostfixFuncCall
    | MixfixFuncCall
    | NofixFuncCall
    ;

NofixFuncCall
    : PrefixFuncAtom
    ;

InfixFuncCall
    : InfixFuncCall FuncId MonoExpr {$$=InfixFuncCallNode($1,$2,$3)}
    | MonoExpr FuncId MonoExpr {$$=InfixFuncCallNode($1,$2,$3)}
    ;

FuncId
    : InfixFuncAtom
    | OperatorAtom
    ;

PrefixFuncCall
    : PrefixFuncAtom MonoExpr
    ;

PostfixFuncCall
    : MonoExpr PostfixFuncAtom
    ;

MixfixFuncCall
    : PrefixFuncAtom MonoExpr InfixFuncAtom 
    | PrefixFuncAtom MonoExpr InfixFuncAtom MonoExpr
    | PrefixFuncAtom MonoExpr InfixFuncAtom MonoExpr PostfixFuncAtom
    | PrefixFuncAtom MonoExpr InfixFuncAtom MonoExpr InfixFuncAtom MonoExpr
    | PrefixFuncAtom MonoExpr InfixFuncAtom MonoExpr InfixFuncAtom MonoExpr PostfixFuncAtom
    | PrefixFuncAtom MonoExpr InfixFuncAtom MonoExpr InfixFuncAtom MonoExpr InfixFuncAtom MonoExpr
    ;

MonoExpr
    : LEFT_PAREN Expression RIGHT_PAREN
    | Value
    ;

Value
    : NIL
    | Object
    | Array
    | BooleanAtom
    | StringAtom
    | NumberAtom
    | VariableAtom
    ;

Object
    : EMPTY_OBJECT_DECLARATOR
    | OBJECT_DECLARATOR NEWLINE INDENT KeyValueList DEDENT
    ;

KeyValueList
    : KeyValueList NEWLINE KeyValue 
    | KeyValue
    ;

KeyValue
    : MembernameAtom LinkOperator Expression
    ;

Array 
    : '[' Elements ']'
    | '[' ']'
    ;

Elements
    : Expression
    | Elements ',' Expression
    ;

BooleanAtom
    : TRUE
    | FALSE
    ;

StringAtom
    : STRING '::' TOKEN_ID
    ;

NumberAtom
    : NUMBER '::' TOKEN_ID {$$=Node($1,$3)}
    ;

PrefixFuncAtom
    : PREFIX_FUNCNAME '::' TOKEN_ID
    ;

PostfixFuncAtom
    : POSTFIX_FUNCNAME '::' TOKEN_ID
    ;

InfixFuncAtom
    : INFIX_FUNCNAME '::' TOKEN_ID
    ;

FuncAtom
    : FUNCNAME '::' TOKEN_ID
    ;

VariableAtom
    : VARNAME '::' TOKEN_ID
    ;

MembernameAtom
    : MEMBERNAME '::' TOKEN_ID
    ;

OperatorAtom    
    : OPERATOR '::' TOKEN_ID {$$=Node($1,$3)}
    ;

TypenameAtom
    : TYPENAME '::' TOKEN_ID
    ;