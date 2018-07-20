
/* description: Parses and executes mathematical expressions. */
%{
const _Declaration     = (body,next)  => ({body,next});

const _Statement       = (body,next)  => ({body,next});

const _PassStatement = () => ({ kind: "PassStatement" });

const _ReturnStatement = (expression) => ({ kind: "ReturnStatement", expression});

const _FunctionDeclaration = (signature,returnType,parameters,statements,affix) => ({
    kind: "FunctionDeclaration",
    signature,
    returnType, 
    parameters, 
    statements, 
    affix,
});

const _WhileStatement = (test,body) => ({ kind: "WhileStatement", test, body });

const _ForStatement = (iterator,expression,body) => ({
    kind: "ForStatement",
    iterator,
    expression,
    body,
});

const _BranchStatement = (test,body,elseBranch) => ({
    kind:"BranchStatement",test,body,elseBranch
});

const _TestExpression = (current, negated, chainOperator, next) => ({
    kind: "TestExpression",
    current,
    negated,
    chainOperator,
    next
});

const _AssignmentStatement = (variable, isDeclaration, isMutable, expression) => ({
    kind: "AssignmentStatement",
    variable,
    isDeclaration,
    isMutable,
    expression
});

const _VariableDeclaration = (variable, typeExpected) => ({
    kind: "VariableDeclaration",
    variable,
    typeExpected,
});

const _Variable = (repr,location) => ({
    kind: "Variable",
    repr,
    location
});

const _ArrayAccess = (subject, index) => ({ kind: "ArrayAccess", subject, index });

const _SimpleType = (name, nullable) => ({ kind: "SimpleType", name, nullable});

const _ArrayType = (typeExpr, nullable) => ({
    kind: "ArrayType",
    nullable,
    arrayOf: typeExpr,
});

const _FunctionCall = (fix,signature,parameters,location) => ({
    kind: "FunctionCall",
    fix,
    signature,
    parameters,
    location
});

const _CurriedMonoFunc = (signature) => ({kind: "CurriedMonoFunc", signature})

const _Pon = (keyValue) => ({
    kind: "Pon",
    keyValueList: keyValue
});

const _KeyValueList = (keyValue, next) => ({keyValue, next});

const _KeyValue = (memberName, expression) => ({
    memberName,
    expression,
});

const _ArrayExpression = (elements,location) => ({ 
    kind: "Array", 
    elements, 
    location
});

const _ArrayElement = (value,next) => ({ kind: "ArrayElement", value, next});

const _StringExpression = (repr,location) => ({kind:"String", repr, location});

const _NumberExpression = (repr,location) => ({kind:"Number", repr, location});

const _BooleanExpression = (repr,location) => ({kind:"Boolean", repr, location});

const _JavascriptCode = (repr,location) => ({kind:"JavascriptCode",repr, location});

const _Token = (repr, location) => ({repr, location});

%}


/* lexical grammar */
%lex
%%
/* Notes: 
 * - If you want to use Regex, DONT use double quotes
 * - If you want to match literally, use double quotes
 */
// Ignorable
\s+         /* skip whitespace */

// Keywords
"let"       return 'LET'
"def"       return 'DEF'
"return"    return 'RETURN'
"if"        return 'IF'
"elif"      return 'ELIF'
"else"      return 'ELSE'
"for"       return 'FOR' 
"in"        return 'IN'
"while"     return 'WHILE'
"mutable"   return 'MUTABLE'
"pass"      return 'PASS'

// Inivisible token
"@NEWLINE"       %{
    this.yy_ = this;
    if(this.yylloc.first_column > 0) {
        return 'NEWLINE'
    } else { 
        /*skip empty whitelines*/ 
    }
%}
"@INDENT"        return 'INDENT'
"@DEDENT"        return 'DEDENT'
"@EOF"           return 'EOF'

// Custom operator literals that might overlap with built-in symbols
[=.<>]{2,} return 'OPERATOR'

// Built-in symbols
"_"     return '_'
","     return ','
"->"    return '->'
"="     return 'ASSIGN_OP'
"("     return '(' 
")"     return ')'
"["     return '['
"]"     return ']'
"o"     return 'LIST_BULLET'
"?"     return '?'

// Literals
["].*?["]                                   return 'STRING'
\<javascript\>(.|[\s\S])*?\<\/javascript\>  return 'JAVASCRIPT'
\d+([.]\d+)?((e|E)[+-]?\d+)?                return 'NUMBER' 
"true"                                      return 'TRUE'
"false"                                     return 'FALSE'
"nil"                                       return 'NIL'

// Identifiers
[.][a-z][a-zA-Z0-9]*            return 'FUNCNAME'    
[a-z][a-zA-Z0-9]*[:]            return 'SUBFUNCNAME'    
[A-Z][a-zA-Z0-9]*               return 'TYPENAME'
[a-z][a-zA-Z]*                  return 'VARNAME'
['][a-z][a-zA-Z0-9]*            return 'MEMBERNAME'
[-!$%^&*_+|~=`\[\]:";'<>?,.\/]+ return 'OPERATOR'


// Misc(to be implemented soon)
"::"                 return '::'
[0-9]+               return 'TOKEN_ID'
"DOT"                return 'DOT'
"UNION_OP"           return 'UNION_OP'
"INTERSECT_OP"       return 'INTERSECT_OP'
"IOFUNCTION"         return 'IOFUNCTION'
"ISNT"               return 'ISNT'
"IS"                 return 'IS'
"AND"                return 'AND'
"OR"                 return 'OR'
/lex

/* operator associations and precedence */
/* the last statement has the highest precedence */
/* the first statement has the lower precedence */
// Note: 
// _$ means yyloc

%right ASSIGN_OP 
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
    : Declaration DeclarationList {$$=_Declaration($1,$2)}
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
    : MembernameTypeList MembernameAtom TypeExpression
    ;

FunctionDeclaration
    : DEF NulliFuncDeclaration  {$$=$2}
    | DEF MonoFuncDeclaration   {$$=$2}
    | DEF BiFuncDeclaration     {$$=$2}
    | DEF TriFuncDeclaration    {$$=$2}
    ;

NulliFuncDeclaration
    : FuncAtom '->' TypeExpression Block 
        {$$=_FunctionDeclaration([$1],$3,[],$4,"Nulli")}
    | FuncAtom Block {$$=_FunctionDeclaration([$1],null,[],$2,"Nulli")}
    ;

MonoFuncDeclaration
    : VarDecl FuncAtom '->' TypeExpression Block 
        {$$=_FunctionDeclaration([$2],$4,[$1],$5,"Mono")}
    | VarDecl FuncAtom Block 
        {$$=_FunctionDeclaration([$2],null,[$1],$3,"Mono")}
    ;

BiFuncDeclaration
    : VarDecl FuncAtom VarDecl '->' TypeExpression Block 
        {$$=_FunctionDeclaration([$2],$5,[$1,$3],$6,"Bi")}
    | VarDecl OperatorAtom VarDecl '->' TypeExpression Block
        {$$=_FunctionDeclaration([$2],$5,[$1,$3],$6,"Bi")}
    ;

TriFuncDeclaration
    : VarDecl FuncAtom '(' VarDecl SubFuncAtom  VarDecl ')' '->' TypeExpression Block
        {$$=_FunctionDeclaration([$2,$5],$9,[$1,$4,$6],$10,"Tri")}
    ;

Block
    : NEWLINE INDENT StatementList DEDENT {$$=$3}
    | NEWLINE INDENT JavascriptCodeAtom NEWLINE DEDENT {$$=_Statement($3,null)}
    | NEWLINE INDENT PASS NEWLINE DEDENT {$$=_Statement(_PassStatement(),null)}
    ;

StatementList
    : Statement StatementList {$$=_Statement($1,$2)}
    | Statement {$$=_Statement($1,null)}
    ;

Statement
    : LinkStatement     NEWLINE     {$$=$1}
    | ReturnStatement   NEWLINE     {$$=$1}
    | AtomicFuncCall    NEWLINE     {$$=$1}
    | ForStatement
    | WhileStatement
    | IfStatement
    ;

ReturnStatement
    : RETURN Expression {$$=_ReturnStatement($2)}
    ;

ForStatement
    : FOR VariableAtom IN Expression Block {$$=_ForStatement($2,$4,$5)}
    ;

WhileStatement
    : WHILE Test Block {$$=_WhileStatement($2,$3)}
    ;

IfStatement
    : IF Test Block               {$$=_BranchStatement($2,$3,null)}
    | IF Test Block ElifChain     {$$=_BranchStatement($2,$3,$4)}
    | IF Test Block ElseStatement {$$=_BranchStatement($2,$3,$4)}
    ;

ElifChain
    : ELIF Test Block ElifChain     {$$=_BranchStatement($2,$3,$4)}
    | ELIF Test Block ElseStatement {$$=_BranchStatement($2,$3,$4)}
    | ELIF Test Block               {$$=_BranchStatement($2,$3,null)}
    ;

ElseStatement
    : ELSE Block {$$=_BranchStatement(null,$2,null)}
    ;
    
Test
    : Expression                                  {$$=_TestExpression($1,false,null,null)}
    | Expression LogicOperatorAtom Test           {$$=_TestExpression($1,false,$2,$3)}
    | NotAtom Expression                          {$$=_TestExpression($1,true,null,null)}
    | NotAtom Expression LogicOperatorAtom Test   {$$=_TestExpression($1,true,$2,$3)}
    ;

LinkStatement
    : LET VarDecl ASSIGN_OP Expression {$$=_AssignmentStatement($2,true,false,$4)}
    | LET VarDecl MUTABLE ASSIGN_OP Expression {$$=_AssignmentStatement($2,true,true,$5)}
    | VariableAtom ASSIGN_OP Expression {$$=_AssignmentStatement($1,false,null,$3)}
    ;

VarDecl /* Variable declaration */
    : VariableAtom                          {$$=_VariableDeclaration($1,null)}
    | VariableAtom TypeExpression           {$$=_VariableDeclaration($1,$2)}
    | '(' VariableAtom ')'                  {$$=_VariableDeclaration($2,null)}
    | '(' VariableAtom TypeExpression ')'   {$$=_VariableDeclaration($2,$3)}
    ;

VariableAtom
    : VARNAME {$$=_Variable($1,this._$)}
    ;

TypeExpression
    : AtomicTypeExpr UNION_OP TypeExpression
    | AtomicTypeExpr INTERSECT_OP TypeExpression
    | AtomicTypeExpr
    ;

AtomicTypeExpr
    : TypenameAtom {$$=_SimpleType($1,false)}
    | TypenameAtom '?' {$$=_SimpleType($1,true)}
    | AtomicTypeExpr '[' ']' {$$=_ArrayType($1,false)}
    | AtomicTypeExpr '[' TupleTypeExpression ']'
    ;

TupleTypeExpression
    : TupleTypeExpression COMMA TypeExpression
    | TypeExpression
    ;


Expression
    : Object
    | MultilineList
    | AtomicExpr
    | OperatorFuncCall
    | CurriedOperatorFunc
    ;

OperatorFuncCall
    : OperatorFuncCall OperatorAtom AtomicExpr {$$=_FunctionCall("Bi",[$2],[$1,$3],this._$)}
    | AtomicExpr OperatorAtom AtomicExpr {$$=_FunctionCall("Bi",[$2],[$1,$3],this._$)}
    ;

AtomicFuncCall
    : NulliFuncCall
    | MonoFuncCall
    | BiFuncCall
    | TriFuncCall
    ;

NulliFuncCall
    : FuncAtom
    ;

MonoFuncCall
    : AtomicExpr FuncAtom {$$=_FunctionCall("Mono",[$2],[$1],this._$)}
    ;

BiFuncCall
    : AtomicExpr FuncAtom '(' Expression ')'  
        {$$=_FunctionCall("Bi",[$2],[$1,$4],this._$)}
    ;

TriFuncCall
    : AtomicExpr FuncAtom '(' Expression SubFuncAtom Expression ')'  
        {$$=_FunctionCall("Tri",[$2,$5],[$1,$4,$6],this._$)}
    ;

AtomicExpr
    : '(' Expression ')' {$$=$2}
    | Value
    | ArrayAccess
    | ArraySlicing
    | ObjectAccessExpr
    | AtomicFuncCall
    | CurriedFunc 
    ;

CurriedFunc
    : CurriedMonoFunc 
    | CurriedBiFunc
    | CurriedTriFunc
    ;

CurriedMonoFunc
    : '_' FuncAtom {$$=_CurriedMonoFunc([$2])}
    ;

CurriedOperatorFunc
    : '_' OperatorAtom AtomicExpr
    | AtomicExpr OperatorAtom '_'
    | '_' OperatorAtom '_'
    ;


ArrayAccess
    : AtomicExpr '[' Expression ']' {$$=_ArrayAccess($1,$3)}
    ;

ArraySlicing
    : AtomicExpr '.{..<' Expression '}' 
    | AtomicExpr '.{..' Expression  '}' 
    | AtomicExpr '.{' Expression  '..}'
    | AtomicExpr '.{' Expression  '..' Expression  '}' 
    | AtomicExpr '.{' Expression  '..<' Expression '}' 
    ;

ObjectAccessExpr
    : AtomicExpr ObjectAccess
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
    | NEWLINE INDENT KeyValueList DEDENT {$$=_Pon($3)}
    ;

KeyValueList
    : KeyValue NEWLINE KeyValueList {$$=_KeyValueList($1,$3)}
    | KeyValue NEWLINE {$$=_KeyValueList($1,null)}
    | KeyValue {$$=_KeyValueList($1,null)}
    ;

KeyValue
    : MembernameAtom ASSIGN_OP Expression {$$=_KeyValue($1,$3)}
    ;

Array
    : '[' Elements ']'   {$$=_ArrayExpression($2,this._$)}
    | '[' ']'            {$$=_ArrayExpression(null,this._$)}
    ;

Elements
    : AtomicExpr {$$=_ArrayElement($1,null)}
    | AtomicExpr ',' Elements  {$$=_ArrayElement($1,$3)}
    ;

MultilineList
    : NEWLINE INDENT MultilineElements DEDENT {$$=_ArrayExpression($3,this._$)}
    ;

MultilineElements
    : LIST_BULLET Expression NEWLINE MultilineElements {$$=_ArrayElement($2,$4)}
    | LIST_BULLET Expression NEWLINE {$$=_ArrayElement($2,null)}
    ;

BooleanAtom
    : TRUE  {$$=_BooleanExpression($1, this._$)}
    | FALSE {$$=_BooleanExpression($1, this._$)}
    ;

StringAtom
    : STRING {$$=_StringExpression($1, this._$)}
    ;

NumberAtom
    : NUMBER {$$=_NumberExpression($1, this._$)}
    ;

FuncAtom
    : FUNCNAME {$$=_Token($1, this._$)}
    ;

SubFuncAtom
    : SUBFUNCNAME {$$=_Token($1, this._$)}
    ;

MembernameAtom
    : MEMBERNAME {$$=_Token($1, this._$)}
    ;

OperatorAtom    
    : OPERATOR {$$=_Token($1, this._$)}
    ;

TypenameAtom
    : TYPENAME {$$=_Token($1, this._$)}
    ;

JavascriptCodeAtom
    : JAVASCRIPT {$$=_JavascriptCode($1, this._$)}
    ;

LogicOperatorAtom
    : AND {$$=_Token($1, this._$)}
    | OR  {$$=_Token($1, this._$)}
    ;
