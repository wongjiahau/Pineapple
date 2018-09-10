
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

const _EnumDeclaration = (name, enums, location) => ({
    kind: "EnumDeclaration",
    name,
    enums,
    location
})

const _StructDeclaration = (name, members, genericList, nullable) => ({
    kind: "StructDeclaration",
    name,
    members,
    genericList,
    nullable
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


const _UnresolvedType = (name, genericList, nullable) => ({ 
    kind: "UnresolvedType", 
    name, 
    genericList,
    nullable
});

const _GenericTypename = (name, nullable) => ({
    kind: "GenericTypename",
    name, // "T" | "T1" | "T2",
    nullable
});

const _FunctionCall = (fix,signature,parameters,location) => ({
    kind: "FunctionCall",
    fix,
    signature,
    parameters,
    location
});

const _EnumExpression = (value) => ({
    kind: "EnumExpression",
    value
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

const _TupleExpression = (elements, location) => ({
    kind: "TupleExpression",
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
\/\/.*      /* skip comment */

// Keywords
"let"       return 'LET'
"def"       return 'DEF'
"async"     return 'ASYNC'
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
[=.<>][-!$%^&*_+|~=`;<>.\/]+ return 'OPERATOR'

// Built-in symbols
"_"     return '_'
","     return 'Comma'
"->"    return 'Arrow'
"="     return 'EqualSign'
"("     return 'LeftParenthesis'
")"     return 'RightParenthesis'
"["     return 'LeftSquareBracket'
"]"     return 'RightSquareBracket'
"{"     return 'LeftCurlyBracket'
"}"     return 'RightCurlyBracket'
"o"     return 'LIST_BULLET'
"?"     return 'QuestionMark'

// Literals
["].*?["]                                   return 'STRING'
\<javascript\>(.|[\s\S])*?\<\/javascript\>  return 'JAVASCRIPT'
\d+([.]\d+)?((e|E)[+-]?\d+)?                return 'NUMBER' 
[#][a-zA-Z0-9]+                             return 'ENUM'

// Identifiers
[.]([a-z][a-zA-Z0-9]*)?         return 'FUNCNAME'    
\b[T][12]?\b                    return 'GENERICTYPENAME'
[A-Z][a-zA-Z0-9]*               return 'TYPENAME'
[a-z][a-zA-Z0-9]*               return 'VARNAME'
[:][a-z][a-zA-Z0-9]*            return 'MEMBERNAME'
[-!$%^&*_+|~=`;<>\/]+ return 'OPERATOR'

/lex

/* operator associations and precedence */
/* the last statement has the highest precedence */
/* the first statement has the lower precedence */
// Note: 
// _$ means yyloc

%right EqualSign 
%left Comma DOT

%start EntryPoint

%% /* language grammar */

EntryPoint
    : DeclarationList EOF {return $1}
    | SinglelineExpr EOF {return $1} // This is for String Interpolation only, not for other uses. Maybe REPL can use this
    ;

DeclarationList
    : Declaration DeclarationList {$$=[$1].concat($2)}
    | Declaration {$$=[$1]} 
    ;


Declaration
    : StructDeclaration
    | FunctionDeclaration
    | ImportDeclaration
    | EnumDeclaration
    ;

EnumDeclaration
    : DEF TypenameAtom NEWLINE INDENT EnumList DEDENT {$$=_EnumDeclaration($2,$5,$2.location)}
    ;

EnumList
    : EnumAtom NEWLINE EnumList {$$=[$1].concat($3)}
    | EnumAtom NEWLINE          {$$=[$1]}
    ;

ImportDeclaration
    : IMPORT StringAtom NEWLINE {$$=_ImportDeclaration($2)}
    ;

StructDeclaration
    : DEF TypenameAtom NEWLINE INDENT MembernameTypeList DEDENT   
        {$$=_StructDeclaration($2,$5,[])}

    | DEF TypenameAtom NEWLINE INDENT PASS NEWLINE DEDENT         
        {$$=_StructDeclaration($2,[],[])}

    | DEF TypenameAtom LeftCurlyBracket GenericList RightCurlyBracket NEWLINE INDENT MembernameTypeList DEDENT   
        {$$=_StructDeclaration($2,$8,$4)}

    | DEF TypenameAtom LeftCurlyBracket GenericList RightCurlyBracket NEWLINE INDENT PASS NEWLINE DEDENT 
        {$$=_StructDeclaration($2,[],$4)}
    ;

GenericList
    : GenericAtom Comma GenericList {$$=[_GenericTypename($1)].concat($3)}
    | GenericAtom                  {$$=[_GenericTypename($1)]}
    ;

MembernameTypeList
    : MemberDefinition NEWLINE MembernameTypeList   {$$=[$1].concat($3)}
    | MemberDefinition NEWLINE                      {$$=[$1]}
    ;

MemberDefinition 
    : MembernameAtom TypeExpression {$$=_MemberDefinition($1,$2)}
    ;

FunctionDeclaration
    : DEF FunctionDecls {$$=$2}
    | DEF ASYNC FunctionDecls {$3.isAsync = true;$$=$3;}
    ;

FunctionDecls
    : NulliFuncDeclaration
    | MonoFuncDeclaration 
    | BiFuncDeclaration   
    | TriFuncDeclaration  
    ;

NulliFuncDeclaration
    : FuncAtom Arrow TypeExpression Block 
        {$$=_FunctionDeclaration([$1],$3,[],$4,"Nulli")}
    | FuncAtom Block {$$=_FunctionDeclaration([$1],null,[],$2,"Nulli")}
    ;

MonoFuncDeclaration
    : VarDecl FuncAtom Arrow TypeExpression Block 
        {$$=_FunctionDeclaration([$2],$4,[$1],$5,"Mono")}
    | VarDecl FuncAtom Block 
        {$$=_FunctionDeclaration([$2],null,[$1],$3,"Mono")}
    
    /* prefix unary operator function */
    | OperatorAtom VarDecl Arrow TypeExpression Block 
        {$$=_FunctionDeclaration([$1],$4,[$2],$5,"Mono")}
    ;

BiFuncDeclaration
    : VarDecl FuncAtom VarDecl Arrow TypeExpression Block 
        {$$=_FunctionDeclaration([$2],$5,[$1,$3],$6,"Bi")}
    | VarDecl FuncAtom VarDecl Block 
        {$$=_FunctionDeclaration([$2],null,[$1,$3],$4,"Bi")}
    
    /* binary operator function */
    | VarDecl OperatorAtom VarDecl Arrow TypeExpression Block
        {$$=_FunctionDeclaration([$2],$5,[$1,$3],$6,"Bi")}
    ;

TriFuncDeclaration
    : VarDecl FuncAtom LeftParenthesis VarDecl VariableAtom  VarDecl RightParenthesis Arrow TypeExpression Block
        {$$=_FunctionDeclaration([$2,$5],$9,[$1,$4,$6],$10,"Tri")}
    | VarDecl FuncAtom LeftParenthesis VarDecl VariableAtom  VarDecl RightParenthesis Block
        {$$=_FunctionDeclaration([$2,$5],null,[$1,$4,$6],$8,"Tri")}
    ;

Block
    : NEWLINE INDENT StatementList DEDENT {$$=$3}
    | NEWLINE INDENT JavascriptCodeAtom NEWLINE DEDENT {$$=[$3]}
    | NEWLINE INDENT PASS NEWLINE DEDENT {$$=[_PassStatement()]}
    ;

StatementList
    : Statement StatementList {$$=[$1].concat($2)}
    | Statement {$$=[$1]}
    ;

Statement
    : AssignmentStatement           
    | ReturnStatement   
    | AtomicFuncCall          NEWLINE {$$=$1}
    | BinaryOperatorCall      NEWLINE {$$=$1}
    | PrefixUnaryOperatorCall NEWLINE {$$=$1}
    | IfStatement                     {$$=$1}
    | ForStatement
    | WhileStatement
    ;

ReturnStatement
    : RETURN MultilineExpr {$$=_ReturnStatement($2, this._$)}
    ;

ForStatement
    : FOR VariableAtom IN SinglelineExpr Block {$$=_ForStatement($2,$4,$5)}
    ;

WhileStatement
    : WHILE SinglelineExpr Block {$$=_WhileStatement($2,$3)}
    ;

IfStatement
    : IF SinglelineExpr Block               {$$=_BranchStatement($2,$3,null)}
    | IF SinglelineExpr Block ElifChain     {$$=_BranchStatement($2,$3,$4)}
    | IF SinglelineExpr Block ElseStatement {$$=_BranchStatement($2,$3,$4)}
    ;

ElifChain
    : ELIF SinglelineExpr Block ElifChain     {$$=_BranchStatement($2,$3,$4)}
    | ELIF SinglelineExpr Block ElseStatement {$$=_BranchStatement($2,$3,$4)}
    | ELIF SinglelineExpr Block               {$$=_BranchStatement($2,$3,null)}
    ;

ElseStatement
    : ELSE Block {$$=_BranchStatement(null,$2,null)}
    ;
    
AssignmentStatement
    : LET VarDecl EqualSign MultilineExpr         {$$=_AssignmentStatement($2,true,$4)}
    | VariableAtom EqualSign MultilineExpr        {$$=_AssignmentStatement($1,false,$3)}
    ;

VarDecl /* Variable declaration */
    : VariableAtom                          {$$=_VariableDeclaration($1,null)}
    | VariableAtom MUTABLE                  {$$=_VariableDeclaration($1,null,true)}
    | VariableAtom TypeExpression           {$$=_VariableDeclaration($1,$2)}
    | VariableAtom TypeExpression MUTABLE   {$$=_VariableDeclaration($1,$2,true)}
    | LeftParenthesis VariableAtom RightParenthesis                  {$$=_VariableDeclaration($2,null)}
    | LeftParenthesis VariableAtom TypeExpression RightParenthesis   {$$=_VariableDeclaration($2,$3)}
    ;

VariableAtom
    : VARNAME {$$=_Variable($1,this._$)}
    ;

TypeExpression
    : AtomicTypeExpr {$$.location = this._$}
    ;

AtomicTypeExpr
    : GenericAtom               {$$=_GenericTypename($1, false)}
    | GenericAtom QuestionMark  {$$=_GenericTypename($1, true)}
    | TypenameAtom              {$$=_UnresolvedType($1,[],false)}
    | TypenameAtom QuestionMark {$$=_UnresolvedType($1,[],true)}
    | TypenameAtom LeftCurlyBracket TypeExprList RightCurlyBracket       
        {$$=_UnresolvedType($1,$3,false)}
    | TypenameAtom LeftCurlyBracket TypeExprList RightCurlyBracket QuestionMark   
        {$$=_UnresolvedType($1,$3,true)}
    ;

TypeExprList
    : AtomicTypeExpr Comma TypeExprList {$$=[$1].concat($3)}
    | AtomicTypeExpr {$$=[$1]}
    ;



MultilineExpr
    : MultilineObject
    | MulitilineDictionary
    | MultilineList
    | SinglelineExpr NEWLINE
    ;

SinglelineExpr
    : AtomicExpr {$$.location = this._$}
    | PrefixUnaryOperatorCall 
    | BinaryOperatorCall
    ;

PrefixUnaryOperatorCall
    : OperatorAtom AtomicExpr {$$=_FunctionCall("Mono", [$1], [$2], this._$)}
    ;

BinaryOperatorCall
    : BinaryOperatorCall OperatorAtom AtomicExpr {$$=_FunctionCall("Bi",[$2],[$1,$3],this._$)}
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
    : AtomicExpr FuncAtom LeftParenthesis SinglelineExpr RightParenthesis  
        {$$=_FunctionCall("Bi",[$2],[$1,$4],this._$)}
    ;

TriFuncCall
    : AtomicExpr FuncAtom LeftParenthesis SinglelineExpr VariableAtom SinglelineExpr RightParenthesis  
        {$$=_FunctionCall("Tri",[$2,$5],[$1,$4,$6],this._$)}
    ;

AtomicExpr 
    : LeftParenthesis SinglelineExpr RightParenthesis {$$=$2}
    // | SinglelineObject /* temporarily disable, unless its use case is justified*/
    | ObjectAccessExpr
    | SinglelineList
    | Tuple
    | AtomicFuncCall 
    | StringAtom
    | NumberAtom
    | EnumAtom {$$=_EnumExpression($1)}
    | VariableAtom
    | AnonymousExpression
    ;

Tuple
    : LeftParenthesis AtomicExpr Comma Elements RightParenthesis {$$=_TupleExpression([$2].concat($4),this._$)}
    ;

ObjectAccessExpr
    : AtomicExpr MembernameAtom {$$=_ObjectAccess($1,$2)}
    ;

MultilineObject
    : Constructor NEWLINE {$$=_ObjectExpr($1,[])}
    | Constructor NEWLINE INDENT MultilineObjectKeyValueList DEDENT {$$=_ObjectExpr($1,$4)}
    ;

Constructor 
    : AtomicTypeExpr
    ;

MultilineObjectKeyValueList
    : MultilineObjectKeyValue MultilineObjectKeyValueList {$$=[$1].concat($2)}
    | MultilineObjectKeyValue {$$=[$1]}
    ;

MultilineObjectKeyValue
    : MembernameAtom EqualSign MultilineExpr {$$=_KeyValue($1,$3)}
    ;

MulitilineDictionary
    : LeftCurlyBracket RightCurlyBracket
    | NEWLINE INDENT MultilineDictionaryKeyValueList DEDENT {$$=_ObjectExpr([], $3)}
    ;

MultilineDictionaryKeyValueList
    : MultilineDictionaryKeyValue MultilineDictionaryKeyValueList {$$=[$1].concat($2)}
    | MultilineDictionaryKeyValue {$$=[$1]}
    ;

MultilineDictionaryKeyValue
    : StringAtom EqualSign MultilineExpr {$$=_KeyValue($1,$3)}
    ;

SinglelineObject
    : LeftCurlyBracket KeyValueList RightCurlyBracket {$$=_ObjectExpr($2)}
    ;

KeyValueList
    : KeyValue KeyValueList {$$=[$1].concat($3)}
    | KeyValue                  {$$=[$1]}
    ;

KeyValue 
    : MembernameAtom EqualSign SinglelineExpr   {$$=_KeyValue($1,$3)}
    | StringAtom EqualSign SinglelineExpr       {$$=_KeyValue($1,$3)}
    ;

SinglelineList
    : LeftSquareBracket Elements RightSquareBracket   {$$=_ListExpression($2,this._$)}
    ;

Elements
    : AtomicExpr Comma Elements  {$$=[$1].concat($3)}
    | AtomicExpr {$$=[$1]}
    ;

MultilineList
    : NEWLINE INDENT MultilineElements DEDENT {$$=_ListExpression($3,this._$)}
    ;

MultilineElements
    : LIST_BULLET MultilineExpr MultilineElements {$$=[$2].concat($3)}
    | LIST_BULLET MultilineExpr {$$=[$2]}
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

MembernameAtom
    : MEMBERNAME {$$=_Token($1, this._$)}
    ;

OperatorAtom    
    : OPERATOR {$$=_Token($1, this._$)}
    ;

TypenameAtom
    : TYPENAME {$$=_Token($1, this._$)}
    ;

EnumAtom
    : ENUM {$$=_Token($1, this._$)}
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