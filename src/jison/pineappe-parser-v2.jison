
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
\s+                  /* skip whitespace */
"::"                 return '::'
"["                  return '['
"]"                  return ']'
","                  return  COMMA
[0-9]+               return 'TOKEN_ID'
"OPERATOR"           return 'OPERATOR'
"INDENT"             return 'INDENT'
"DEDENT"             return 'DEDENT'
"EOF"                return 'EOF'
"DOT"                return 'DOT'
"LEFT_PAREN"         return 'LEFT_PAREN'
"RIGHT_PAREN"        return 'RIGHT_PAREN'
"FUNCNAME"           return 'FUNCNAME'
"VARNAME"            return 'VARNAME'
"MEMBERNAME"         return 'MEMBERNAME'
"TYPENAME"           return 'TYPENAME'
"ASSIGN_OP"          return 'ASSIGN_OP'
"BIND_OP"            return 'BIND_OP'
"UNION_OP"           return 'UNION_OP'
"INTERSECT_OP"       return 'INTERSECT_OP'
"TYPE_OP"            return 'TYPE_OP'
"NEWLINE"            return 'NEWLINE'
"LET"                return 'LET'
"NIL"                return 'NIL'
"NUMBER"             return 'NUMBER' 
"STRING"             return 'STRING'
"TRUE"               return 'TRUE'
"FALSE"              return 'FALSE'
"IOFUNCTION"         return 'IOFUNCTION'
"FUNCTION"           return 'FUNCTION'
"IF"                 return 'IF'
"ELIF"               return 'ELIF'
"ELSE"               return 'ELSE'
"ISNT"               return 'ISNT'
"IS"                 return 'IS'
"AND"                return 'AND'
"OR"                 return 'OR'
"RETURN"             return 'RETURN'
/lex

/* operator associations and precedence */
/* the last statement has the highest precedence */
/* the first statement has the lower precedence */

%right ASSIGN_OP BIND_OP TYPE_OP
%left ',' DOT
%left BINOP2 '+' '-'
%left UMINUS
%left '::' TOKEN_ID OPERATOR NUMBER

%start EntryPoint

%% /* language grammar */

EntryPoint
    : Declaration EOF {return $1}
    ;

Declaration
    : TypeDeclaration
    | FunctionDeclaration
    ;

TypeDeclaration
    : TYPE TypenameAtom NEWLINE INDENT MembernameTypeList DEDENT
    ;

MembernameTypeList
    : MembernameTypeList MembernameAtom TYPE_OP TypeExpression
    ;

FunctionDeclaration
    : FunctionAnnotation InfixFuncDeclaration
    | FunctionAnnotation PrefixFuncDeclaration
    | FunctionAnnotation SuffixFuncDeclaration
    | FunctionAnnotation NofixFuncDeclaration
    | FunctionAnnotation MixfixFuncDeclaration
    ;

FunctionAnnotation
    : FUNCTION NEWLINE
    | IOFUNCTION NEWLINE
    ;

InfixFuncDeclaration
    : Parameter FuncAtom Parameter RETURN TypeExpression Block
    | Parameter LEFT_PAREN OperatorAtom RIGHT_PAREN Parameter RETURN TypeExpression Block
    ;

PrefixFuncDeclaration
    : FuncAtom Parameter RETURN TypeExpression Block
    ;

SuffixFuncDeclaration
    : Parameter FuncAtom RETURN TypeExpression Block
    ;

NofixFuncDeclaration
    : FuncAtom RETURN TypeExpression Block
    ;

MixfixFuncDeclaration
    : FuncAtom Parameter FuncAtom RETURN TypeExpression Block
    | FuncAtom Parameter FuncAtom Parameter RETURN TypeExpression Block
    | FuncAtom Parameter FuncAtom Parameter FuncAtom RETURN TypeExpression Block
    | FuncAtom Parameter FuncAtom Parameter FuncAtom Parameter RETURN TypeExpression Block
    | FuncAtom Parameter FuncAtom Parameter FuncAtom Parameter FuncAtom RETURN TypeExpression Block
    | FuncAtom Parameter FuncAtom Parameter FuncAtom Parameter FuncAtom Parameter RETURN TypeExpression Block
    ;

Parameter
    : VariableAtom TYPE_OP TypeExpression
    ;

Block
    : NEWLINE INDENT StatementList DEDENT
    ;

StatementList
    : StatementList Statement NEWLINE
    | Statement NEWLINE
    ;


Statement
    : LinkStatement
    | ReturnStatement
    | ForStatement
    | WhileStatement
    | IfStatement
    | FuncCall
    ;

ReturnStatement
    : RETURN Expression
    ;

ForStatement
    : FOR VariableAtom IN Expression Block
    ;

WhileStatement
    : WHILE Test Block
    ;

IfStatement
    : IF Test Block
    | IF Test Block ElifChain
    | IF Test Block ElseStatement
    ;

ElifChain
    : ElifChain ElifStatement
    | ElifStatement ElseStatement
    | ElifStatement
    ;

ElifStatement
    : ELIF Test Block
    ;

ElseStatement
    : ELSE Block
    ;
    
Test
    : BoolFuncCall
    | BoolFuncCall TestChain 
    | BoolFuncCall PartialBoolFuncCallChain
    | ExpressionChain PartialBoolFuncCall
    ;

TestChain
    : TestChain LogicOperatorAtom BoolFuncCall 
    | LogicOperatorAtom BoolFuncCall
    ;

BoolFuncCall
    : Expression PartialBoolFuncCall
    ;

PartialBoolFuncCallChain
    : PartialBoolFuncCallChain LogicOperatorAtom PartialBoolFuncCall 
    | LogicOperatorAtom PartialBoolFuncCall
    ;

ExpressionChain
    : ExpressionChain LogicOperatorAtom Expression
    | Expression LogicOperatorAtom Expression
    ;

LogicOperatorAtom
    : AND
    | OR
    ;

PartialBoolFuncCall
    : IsOrIsnt CurriedBoolFunc
    ;

IsOrIsnt
    : IS
    | ISNT
    ;

CurriedBoolFunc
    : SuffixFuncAtom 
    | InfixFuncAtom MonoExpr 
    | InfixFuncAtom MonoExpr SuffixFuncAtom
    | InfixFuncAtom MonoExpr InfixFuncAtom MonoExpr
    | OperatorAtom MonoExpr
    ;


LinkStatement
    : LET VariableAtom LinkOperator Expression
    | LET VariableAtom TYPE_OP TypeExpression LinkOperator Expression
    | VariableAtom LinkOperator Expression
    ;

LinkOperator
    : BIND_OP
    | ASSIGN_OP
    ;

TypeExpression
    : TypenameAtom
    | TypenameAtom '[' ']'
    | TypenameAtom '[' Expression ']'
    | TypenameAtom '[' TypeExpressionList ']'
    | TypeExpression UNION_OP TypenameAtom
    | TypeExpression INTERSECT_OP TypenameAtom
    | '(' TypeExpression ')'
    ;

TypeExpressionList
    : TypeExpressionList COMMA TypeExpression
    | TypeExpression
    ;


Expression
    : FuncCall
    | Object
    | MonoExpr
    ;

FuncCall
    : InfixFuncCall
    | PrefixFuncCall
    | SuffixFuncCall
    | MixfixFuncCall
    | NofixFuncCall
    ;

NofixFuncCall
    : FuncAtom
    ;

InfixFuncCall
    : InfixFuncCall FuncId MonoExpr {$$=InfixFuncCallNode($1,$2,$3)}
    | MonoExpr FuncId MonoExpr {$$=InfixFuncCallNode($1,$2,$3)}
    ;

FuncId
    : FuncAtom
    | OperatorAtom
    ;

PrefixFuncCall
    : FuncAtom MonoExpr
    ;

SuffixFuncCall
    : MonoExpr FuncAtom
    ;

MixfixFuncCall
    : FuncAtom MonoExpr FuncAtom 
    | FuncAtom MonoExpr FuncAtom MonoExpr
    | FuncAtom MonoExpr FuncAtom MonoExpr FuncAtom
    | FuncAtom MonoExpr FuncAtom MonoExpr FuncAtom MonoExpr
    | FuncAtom MonoExpr FuncAtom MonoExpr FuncAtom MonoExpr FuncAtom
    | FuncAtom MonoExpr FuncAtom MonoExpr FuncAtom MonoExpr FuncAtom MonoExpr
    ;

MonoExpr
    : LEFT_PAREN Expression RIGHT_PAREN
    | Value
    | ArrayAccess
    | ArraySlicing
    | ObjectAccessExpr
    ;

ArrayAccess
    : MonoExpr '.{' Expression '}'
    ;

ArraySlicing
    : MonoExpr '.{..<' Expression '}' 
    | MonoExpr '.{..' Expression  '}' 
    | MonoExpr '.{' Expression  '..}'
    | MonoExpr '.{' Expression  '..' Expression  '}' 
    | MonoExpr '.{' Expression  '..<' Expression '}' 
    ;

ObjectAccessExpr
    : MonoExpr ObjectAccess
    ;

ObjectAccess
    : MembernameAtom
    | '{' Expression '}'
    ;

Value
    : NIL
    | Array
    | BooleanAtom
    | StringAtom
    | NumberAtom
    | VariableAtom
    ;

Object
    : EMPTY_OBJECT_DECLARATOR
    | NEWLINE INDENT KeyValueList DEDENT
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
    | Elements COMMA Expression
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
