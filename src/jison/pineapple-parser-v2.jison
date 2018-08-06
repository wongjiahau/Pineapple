
/* description: Parses and executes mathematical expressions. */
%{
const _LinkedNode = (current, next) => ({current, next});

const _PassStatement = () => ({ kind: "PassStatement" });

const _ReturnStatement = (expression,location) => ({ kind: "ReturnStatement", expression, location});

const _FunctionDeclaration = (signature,returnType,parameters,statements,affix) => ({
    kind: "FunctionDeclaration",
    signature,
    returnType, 
    parameters, 
    statements, 
    affix,
});

const _StructDeclaration = (name, members) => ({
    kind: "StructDeclaration",
    name,
    members
});

const _MemberDefinition = (name, expectedType) => ({
    name,
    expectedType
})

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

const _ImportDeclaration = (filename) => ({
    kind: "ImportDeclaration",
    filename,
});

const _AssignmentStatement = (variable, isDeclaration, expression) => ({
    kind: "AssignmentStatement",
    variable,
    isDeclaration,
    expression
});

const _VariableDeclaration = (variable, typeExpected, isMutable=false) => ({
    kind: "VariableDeclaration",
    variable,
    typeExpected,
    isMutable
});

const _Variable = (repr,location) => ({
    kind: "Variable",
    repr,
    location
});


const _SimpleType = (name, nullable) => ({ kind: "SimpleType", name, nullable});

const _CompoundType = (name, typeExpr, nullable) => ({
    kind: "CompoundType",
    name,
    nullable,
    of: typeExpr,
});

const _GenericType = (placeholder, nullable) => ({
    kind: "GenericType",
    placeholder, // "T" | "T1" | "T2",
    nullable
});

const _FunctionCall = (fix,signature,parameters,location) => ({
    kind: "FunctionCall",
    fix,
    signature,
    parameters,
    location
});

const _FunctionType = (inputType, outputType) => ({
    kind: "FunctionType",
    inputType,
    outputType
});

const _ObjectExpr = (constructor, keyValueList) => ({
    kind: "ObjectExpression",
    constructor,
    keyValueList,
});

const _KeyValue = (memberName, expression) => ({
    memberName,
    expression,
});

const _ObjectAccess = (subject, key) => ({
    kind: "ObjectAccess",
    subject,
    key
});

const _ListExpression = (elements,location) => ({ 
    kind: "List", 
    elements, 
    location
});


const _StringExpression = (repr,location) => ({kind:"String", repr, location});

const _NumberExpression = (repr,location) => ({kind:"Number", repr, location});

const _BooleanExpression = (repr,location) => ({kind:"Boolean", repr, location});

const _JavascriptCode = (repr,location) => ({kind:"JavascriptCode",repr, location});

const _Token = (repr, location) => ({repr, location});

const _AnonymousExpression = (location) => ({
    kind: "AnonymousExpression",
    location
});

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
"import"    return 'IMPORT'

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
[=.<>][-!$%^&*_+|~=`\[\]:";'<>?,.\/]+ return 'OPERATOR'

// Built-in symbols
"_"     return '_'
","     return ','
"->"    return '->'
"="     return 'ASSIGN_OP'
"("     return '(' 
")"     return ')'
"["     return '['
"]"     return ']'
"{"     return '{'
"}"     return '}'
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
[.]([a-z][a-zA-Z0-9]*)?         return 'FUNCNAME'    
([a-z][a-zA-Z0-9]*)?[:]         return 'SUBFUNCNAME'    
[T][12]?                        return 'GENERICTYPENAME'
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
    : Declaration DeclarationList {$$=_LinkedNode($1,$2)}
    | Declaration {$$=_LinkedNode($1,null)} 
    ;


Declaration
    : StructDeclaration
    | FunctionDeclaration
    | ImportDeclaration
    ;

ImportDeclaration
    : IMPORT StringAtom NEWLINE {$$=_ImportDeclaration($2)}
    ;

StructDeclaration
    : DEF TypenameAtom NEWLINE INDENT MembernameTypeList DEDENT {$$=_StructDeclaration($2,$5)}
    ;

MembernameTypeList
    : MemberDefinition NEWLINE MembernameTypeList   {$$=_LinkedNode($1,$3)}
    | MemberDefinition NEWLINE                      {$$=_LinkedNode($1,null)}
    ;

MemberDefinition 
    : MembernameAtom TypeExpression {$$=_MemberDefinition($1,$2)}
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
    | NEWLINE INDENT JavascriptCodeAtom NEWLINE DEDENT {$$=_LinkedNode($3,null)}
    | NEWLINE INDENT PASS NEWLINE DEDENT {$$=_LinkedNode(_PassStatement(),null)}
    ;

StatementList
    : Statement StatementList {$$=_LinkedNode($1,$2)}
    | Statement {$$=_LinkedNode($1,null)}
    ;

Statement
    : AssignmentStatement           {$$=$1}
    | ReturnStatement   NEWLINE     {$$=$1}
    | AtomicFuncCall    NEWLINE     {$$=$1}
    | IfStatement                   {$$=$1}
    | ForStatement
    | WhileStatement
    ;

ReturnStatement
    : RETURN SinglelineExpr {$$=_ReturnStatement($2, this._$)}
    ;

ForStatement
    : FOR VariableAtom IN SinglelineExpr Block {$$=_ForStatement($2,$4,$5)}
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
    : SinglelineExpr                                  {$$=_TestExpression($1,false,null,null)}
    | SinglelineExpr LogicOperatorAtom Test           {$$=_TestExpression($1,false,$2,$3)}
    | NotAtom SinglelineExpr                          {$$=_TestExpression($1,true,null,null)}
    | NotAtom SinglelineExpr LogicOperatorAtom Test   {$$=_TestExpression($1,true,$2,$3)}
    ;

AssignmentStatement
    : LET VarDecl ASSIGN_OP MultilineExpr         {$$=_AssignmentStatement($2,true,$4)}
    | VariableAtom ASSIGN_OP MultilineExpr        {$$=_AssignmentStatement($1,false,$3)}
    ;

VarDecl /* Variable declaration */
    : VariableAtom                          {$$=_VariableDeclaration($1,null)}
    | VariableAtom MUTABLE                  {$$=_VariableDeclaration($1,null,true)}
    | VariableAtom TypeExpression           {$$=_VariableDeclaration($1,$2)}
    | VariableAtom TypeExpression MUTABLE   {$$=_VariableDeclaration($1,$2,true)}
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
    : TypenameAtom              {$$=_SimpleType($1,false)}
    | TypenameAtom '?'          {$$=_SimpleType($1,true)}
    | GenericAtom               {$$=_GenericType($1, false)}
    | GenericAtom '?'           {$$=_GenericType($1, true)}
    | '(' TypeExpression '->' TypeExpression ')' {$$=_FunctionType([$2],$4)}
    | '(' TypeExpression ',' TypeExpression '->' TypeExpression ')' 
    | TypenameAtom '{' TypeExpressionList '}' {$$=_CompoundType($1,$3, false)}
    | TypenameAtom '{' TypeExpressionList '}' '?' {$$=_CompoundType($1,$3, true)}
    ;

TypeExpressionList
    : TypeExpression ',' TypeExpressionList {$$=_LinkedNode($1,$3)}
    | TypeExpression {$$=_LinkedNode($1,null)}
    ;



MultilineExpr
    : MultilineObject
    | MulitilineDictionary
    | MultilineList
    | SinglelineExpr NEWLINE
    ;

SinglelineExpr
    : AtomicExpr
    | OperatorFuncCall
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
    : FuncAtom  {$$=_FunctionCall("Nulli",[$1],[],this._$)}
    ;

MonoFuncCall
    : AtomicExpr FuncAtom {$$=_FunctionCall("Mono",[$2],[$1],this._$)}
    ;

BiFuncCall
    : AtomicExpr FuncAtom '(' SinglelineExpr ')'  
        {$$=_FunctionCall("Bi",[$2],[$1,$4],this._$)}
    ;

TriFuncCall
    : AtomicExpr FuncAtom '(' SinglelineExpr SubFuncAtom SinglelineExpr ')'  
        {$$=_FunctionCall("Tri",[$2,$5],[$1,$4,$6],this._$)}
    ;

AtomicExpr
    : '(' SinglelineExpr ')' {$$=$2}
    // | SinglelineObject /* temporarily disable, unless its use case is justified*/
    | ObjectAccessExpr
    | SinglelineList
    | AtomicFuncCall
    | BooleanAtom
    | StringAtom
    | NumberAtom
    | VariableAtom
    | AnonymousExpression
    | NIL
    ;

ObjectAccessExpr
    : AtomicExpr MembernameAtom {$$=_ObjectAccess($1,$2)}
    ;

MultilineObject
    : TypenameAtom NEWLINE INDENT MultilineObjectKeyValueList DEDENT {$$=_ObjectExpr($1,$4)}
    ;

MultilineObjectKeyValueList
    : MultilineObjectKeyValue MultilineObjectKeyValueList {$$=_LinkedNode($1,$2)}
    | MultilineObjectKeyValue {$$=_LinkedNode($1,null)}
    ;

MultilineObjectKeyValue
    : MembernameAtom ASSIGN_OP MultilineExpr {$$=_KeyValue($1,$3)}
    ;

MulitilineDictionary
    : '{' '}'
    | NEWLINE INDENT MultilineDictionaryKeyValueList DEDENT {$$=_ObjectExpr(null, $3)}
    ;

MultilineDictionaryKeyValueList
    : MultilineDictionaryKeyValue MultilineDictionaryKeyValueList {$$=_LinkedNode($1,$2)}
    | MultilineDictionaryKeyValue {$$=_LinkedNode($1,null)}
    ;

MultilineDictionaryKeyValue
    : StringAtom ASSIGN_OP MultilineExpr {$$=_KeyValue($1,$3)}
    ;

SinglelineObject
    : '{' KeyValueList '}' {$$=_ObjectExpr($2)}
    ;

KeyValueList
    : KeyValue ',' KeyValueList {$$=_LinkedNode($1,$3)}
    | KeyValue                  {$$=_LinkedNode($1,null)}
    ;

KeyValue 
    : MembernameAtom ASSIGN_OP SinglelineExpr   {$$=_KeyValue($1,$3)}
    | StringAtom ASSIGN_OP SinglelineExpr       {$$=_KeyValue($1,$3)}
    ;

SinglelineList
    : '[' Elements ']'   {$$=_ListExpression($2,this._$)}
    | '[' ']'            {$$=_ListExpression(null,this._$)}
    ;

Elements
    : AtomicExpr ',' Elements  {$$=_LinkedNode($1,$3)}
    | AtomicExpr {$$=_LinkedNode($1,null)}
    ;

MultilineList
    : NEWLINE INDENT MultilineElements DEDENT {$$=_ListExpression($3,this._$)}
    ;

MultilineElements
    : LIST_BULLET SinglelineExpr NEWLINE MultilineElements {$$=_LinkedNode($2,$4)}
    | LIST_BULLET SinglelineExpr NEWLINE {$$=_LinkedNode($2,null)}
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

GenericAtom
    : GENERICTYPENAME {$$=_Token($1, this._$)}
    ;

JavascriptCodeAtom
    : JAVASCRIPT {$$=_JavascriptCode($1, this._$)}
    ;

LogicOperatorAtom
    : AND {$$=_Token($1, this._$)}
    | OR  {$$=_Token($1, this._$)}
    ;

AnonymousExpression
    : '_' {$$=_AnonymousExpression(this._$)}
    ;