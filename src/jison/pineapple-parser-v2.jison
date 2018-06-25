
/* description: Parses and executes mathematical expressions. */
%{
const _Declaration = (body,next) => ({body,next});

const _Statement = (body,next) => ({body,next});

const _FunctionDeclaration = (signature,returnType,parameters,statements,affix) => ({
    kind: "FunctionDeclaration",
    signature: signature.slice(0,-1),  // Remove trailing colon
    returnType, 
    parameters, 
    statements, 
    affix,
});

const _LinkStatement = (variable,linkType,expression,isDeclaration) => ({
    kind: "LinkStatement",
    isDeclaration,
    variable,
    linkType,
    expression
});

const _Variable = (name,typeExpected) => ({
    kind: "Variable",
    name,
    typeExpected
});

const _TypeExpression = (name, isList, listSize) => ({
    kind: "TypeExpression",
    name,
    isList,
    listSize,
    // tuple: TupleTypeExpression;
    // operator: "union" | "intersect";
    // next: TypeExpression;
});

const _FunctionCall = (fix,signature,parameters) => ({
    kind: "FunctionCall",
    fix,
    signature: signature.slice(0,-1), // Remove trailing colon
    parameters,
});

const _Atom = (type, tokenId) => ({type,tokenId});

const _StringExpression = (value) => ({kind:"String", value});

const _NumberExpression = (value) => ({kind:"Number", value});

const _JavascriptCode = (token) => ({kind:"JavascriptCode",value:token});

const _Token = (value, location) => ({value, location});

function _getOperatorName(op) {
    const dic = {
        "+" : "plus"
    };
    return "$" + dic[op] + ":";
}
%}


/* lexical grammar */
%lex
%%
// Ignorable
\s+     /* skip whitespace */

// Annotations
"--function"    return 'FUNCTION'

// Keywords
"let"   return 'LET'
"as"    return 'TYPE_OP'

// Inivisible token
"@NEWLINE"  return 'NEWLINE'
"@INDENT"   return 'INDENT'
"@DEDENT"   return 'DEDENT'
"@EOF"      return 'EOF'

// Built-in symbols
"->"    return 'RETURN'
"="     return 'BIND_OP'
"("     return 'LEFT_PAREN' 
")"     return 'RIGHT_PAREN'

// Literals
['].*?[']                                   return 'STRING'
\<javascript\>(.|[\s\S])*?\<\/javascript\>  return 'JAVASCRIPT'
\d+([.]\d+)?((e|E)[+-]?\d+)?                return 'NUMBER' 

// Identifiers
[a-z][a-zA-Z0-9]*[:]            return 'FUNCNAME'    
[A-Z][a-zA-Z0-9]*               return 'TYPENAME'
[a-z][a-zA-Z]*                  return 'VARNAME'
[-!$%^&*_+|~=`\[\]:";'<>?,.\/]+ return 'OPERATOR'



"::"                 return '::'
"["                  return '['
"]"                  return ']'
","                  return  COMMA
[0-9]+               return 'TOKEN_ID'
"DOT"                return 'DOT'
"MEMBERNAME"         return 'MEMBERNAME'
"ASSIGN_OP"          return 'ASSIGN_OP'
"UNION_OP"           return 'UNION_OP'
"INTERSECT_OP"       return 'INTERSECT_OP'
"NIL"                return 'NIL'
"TRUE"               return 'TRUE'
"FALSE"              return 'FALSE'
"IOFUNCTION"         return 'IOFUNCTION'
"IF"                 return 'IF'
"ELIF"               return 'ELIF'
"ELSE"               return 'ELSE'
"ISNT"               return 'ISNT'
"IS"                 return 'IS'
"AND"                return 'AND'
"OR"                 return 'OR'
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
    : DeclarationList EOF {return $1}
    ;

DeclarationList
    : Declaration NEWLINE DeclarationList {$$=_Declaration($1,$3)}
    | Declaration {$$=_Declaration($1,null)} 
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
    : FunctionAnnotation NofixFuncDeclaration  {$$=$2}
    | FunctionAnnotation PrefixFuncDeclaration {$$=$2}
    | FunctionAnnotation SuffixFuncDeclaration {console.log("suffix")}
    | FunctionAnnotation InfixFuncDeclaration  {$$=$2}
    | FunctionAnnotation MixfixFuncDeclaration {console.log("mixfix")}
    ;

FunctionAnnotation
    : FUNCTION NEWLINE
    | IOFUNCTION NEWLINE 
    ;

InfixFuncDeclaration
    : Variable FuncAtom Variable RETURN TypeExpression Block
    | Variable LEFT_PAREN OperatorAtom RIGHT_PAREN Variable RETURN TypeExpression Block
        {$$=_FunctionDeclaration($3,$7,[$1,$5],$8,"infix")}
    ;

PrefixFuncDeclaration
    : FuncAtom Variable RETURN TypeExpression Block 
        {$$=_FunctionDeclaration($1,$4,[$2],$5,"prefix")}
    | FuncAtom Variable Block {$$=_FunctionDeclaration($1,null,[$2],$3,"prefix")}
    ;

SuffixFuncDeclaration
    : Variable FuncAtom RETURN TypeExpression Block
    ;

NofixFuncDeclaration
    : FuncAtom RETURN TypeExpression Block
        {$$=_FunctionDeclaration($1,$3,[],$4,"nofix")}
    | FuncAtom Block {$$=_FunctionDeclaration($1,null,[],$2,"nofix")}
    ;

MixfixFuncDeclaration
    : FuncAtom Variable FuncAtom RETURN TypeExpression Block
    | FuncAtom Variable FuncAtom Variable RETURN TypeExpression Block
    | FuncAtom Variable FuncAtom Variable FuncAtom RETURN TypeExpression Block
    | FuncAtom Variable FuncAtom Variable FuncAtom Variable RETURN TypeExpression Block
    | FuncAtom Variable FuncAtom Variable FuncAtom Variable FuncAtom RETURN TypeExpression Block
    | FuncAtom Variable FuncAtom Variable FuncAtom Variable FuncAtom Variable RETURN TypeExpression Block
    ;

Block
    : NEWLINE INDENT StatementList DEDENT {$$=$3}
    | NEWLINE INDENT JavascriptCodeAtom NEWLINE DEDENT {$$=_Statement($3,null)}
    ;

StatementList
    : Statement NEWLINE StatementList {$$=_Statement($1,$3)}
    | Statement NEWLINE {$$=_Statement($1,null)}
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
    : MonoExpr PartialBoolFuncCall
    ;

PartialBoolFuncCallChain
    : PartialBoolFuncCallChain LogicOperatorAtom PartialBoolFuncCall 
    | LogicOperatorAtom PartialBoolFuncCall
    ;

ExpressionChain
    : ExpressionChain LogicOperatorAtom MonoExpr
    | MonoExpr LogicOperatorAtom MonoExpr
    ;

LogicOperatorAtom
    : AND
    | OR
    ;

PartialBoolFuncCall
    : FuncAtom 
    | FuncAtom MonoExpr 
    | FuncAtom MonoExpr FuncAtom
    | FuncAtom MonoExpr FuncAtom MonoExpr
    | OperatorAtom MonoExpr
    ;

LinkStatement
    : LET Variable LinkOperator Expression {$$=_LinkStatement($2,$3,$4,true)}
    | VariableAtom LinkOperator Expression {$$=_LinkStatement($1,$2,$3,false)}
    ;

Variable 
    : VariableAtom {$$=_Variable($1,null)}
    | VariableAtom TYPE_OP TypeExpression {$$=_Variable($1,$3)}
    | LEFT_PAREN VariableAtom TYPE_OP TypeExpression RIGHT_PAREN {$$=_Variable($2,$4)}
    ;

LinkOperator
    : BIND_OP
    | ASSIGN_OP
    ;

TypeExpression
    : TypenameAtom {$$=_TypeExpression($1,false,0)}
    | TypenameAtom '[' ']'
    | TypenameAtom '[' Expression ']'
    | TypenameAtom '[' TupleTypeExpression ']'
    | TypeExpression UNION_OP TypenameAtom
    | TypeExpression INTERSECT_OP TypenameAtom
    | '(' TypeExpression ')'
    ;

TupleTypeExpression
    : TupleTypeExpression COMMA TypeExpression
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
    : InfixFuncCall FuncId MonoExpr 
    | MonoExpr FuncId MonoExpr {$$=_FunctionCall("infix",$2,[$1,$3])}
    ;

FuncId
    : FuncAtom
    | OperatorAtom
    ;

PrefixFuncCall
    : FuncAtom MonoExpr {$$=_FunctionCall("prefix",$1,[$2])}
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
    | VariableAtom {$$=_Variable($1,null)}
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
    : STRING {$$=_StringExpression($1)}
    ;

NumberAtom
    : NUMBER {$$=_NumberExpression($1)}
    ;

FuncAtom
    : FUNCNAME 
    ;

VariableAtom
    : VARNAME {$$=_Token($1, this._$)} // Note: _$ means yyloc
    ;

MembernameAtom
    : MEMBERNAME '::' TOKEN_ID
    ;

OperatorAtom    
    : OPERATOR {$$=_getOperatorName($1)}
    ;

TypenameAtom
    : TYPENAME
    ;

JavascriptCodeAtom
    : JAVASCRIPT {$$=_JavascriptCode($1)}
    ;