/*

Author: Wong Jia Hau
License: Apache 2.0
Description:

    This file is to describe the grammar of Pineapple language.
    It will be used by Jison to generate a parser.

Abbreviations:

    Decl    Declaration
    Func    Function 
    Expr    Expression
    Stmt    Statement
    Op      Operator
    Id      Identifier
    Sym     Symbol 
    Lit     Literal
    Var     Variable
    Param   Parameter of Function 
    Assign  Assignment
    Init    Initialization
*/

%{

const _EnumDecl = (name, enums, location) => ({
    kind: "EnumDeclaration",
    name,
    enums,
    location
})

const _FuncDecl = (signature,returnType,parameters,statements,affix) => ({
    kind: "FunctionDeclaration",
    signature,
    returnType, 
    parameters, 
    statements, 
    affix,
});

const _ThingDecl = (name, members, genericList, location) => ({
    kind: "ThingDecl",
    name,
    members,
    genericList,
    location
});

const _ThingUpdate = (toBeUpdated, updatedKeyValues) => ({
    kind: "ThingUpdate",
    toBeUpdated,
    updatedKeyValues
});

const _AssignStmt = (variable, isDeclaration, expression) => ({
    kind: "AssignmentStatement",
    variable,
    isDeclaration,
    expression
});

const _ReturnStmt = (expression,location) => ({ kind: "ReturnStatement", expression, location});

const _VarDecl = (variable, typeExpected, isMutable=false) => ({
    kind: "VariableDeclaration",
    variable,
    typeExpected,
    isMutable
});

const _MemberId = (name, expectedType) => ({
    name,
    expectedType
})

const _FuncCall = (fix,signature,parameters,location) => ({
    kind: "FunctionCall",
    fix,
    signature,
    parameters,
    location
});

const _UnresolvedType = (name, genericList, nullable) => ({ 
    kind: "UnresolvedType", 
    name, 
    genericList,
    nullable
});

const _ThingExpr = (constructor, keyValueList) => ({
    kind: "ThingExpr",
    constructor,
    keyValueList,
});

const _ThingAccess = (subject, key) => ({
    kind: "ThingAccess",
    subject,
    key
});

const _KeyValue = (memberName, expression) => ({
    memberName,
    expression,
});

const _JavascriptCode = (repr,location) => ({kind:"JavascriptCode",repr, location});
const _Token = (repr, location) => ({repr, location});
const _StringExpression = (repr,location) => ({kind:"String", repr, location});
const _NumberExpression = (repr,location) => ({kind:"Number", repr, location});
const _EnumExpression = (repr,location) => ({ kind: "EnumExpression", repr, location });
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
"ensure"    return 'ENSURE'
"async"     return 'ASYNC'
"def"       return 'DEF'
"elif"      return 'ELIF'
"else"      return 'ELSE'
"for"       return 'FOR' 
"if"        return 'IF'
"import"    return 'IMPORT'
"in"        return 'IN'
"let"       return 'LET'
"mutable"   return 'MUTABLE'
"pass"      return 'PASS'
"return"    return 'RETURN'
"while"     return 'WHILE'
"example"   return 'EXAMPLE'
"is"        return 'IS'
"where"     return 'WHERE'
"group"     return 'GROUP'
"enum"      return 'ENUM'
"thing"     return 'THING'
"with"      return 'WITH'

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

// Custom OP_ID literals that might overlap with built-in operators
[=.<>][-!$%^&*_+|~=`;<>.\/]+ return 'OP_ID'

// Built-in operators
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
["].*?["]                                   return 'STRINGLIT'
\<javascript\>(.|[\s\S])*?\<\/javascript\>  return 'JAVASCRIPT'
\d+([.]\d+)?((e|E)[+-]?\d+)?                return 'NUMBERLIT' 
[#][a-zA-Z0-9]+                             return 'ENUMLIT'

// Identifiers
[.][a-z][a-zA-Z0-9]*            return 'MEMBER_ID'
[.]([A-Z][a-zA-Z0-9]*)?         return 'FUNC_ID'    
[A-Z][a-zA-Z0-9]*               return 'SUBFUNC_ID'
\b[T][12]?\b                    return 'GENERICTYPENAME'
[:][a-z][a-zA-Z0-9]*            return 'TYPE_ID'
[a-z][a-zA-Z0-9]*               return 'VAR_ID'
[-!$%^&*_+|~=`;<>\/]+           return 'OP_ID'

/lex

/* Operator associations and precedence */
/* the last statement has the highest precedence */
/* the first statement has the lower precedence */
// Note: 
// _$ means yyloc

%right EqualSign 
%left Comma DOT

%start EntryPoint

%% /* language grammar */


EntryPoint
    : DeclList       EOF {return $1}
    | SinglelineExpr EOF {return $1} // This is for String Interpolation only, not for other uses. Maybe REPL can use this
    ;

DeclList
    : Decl DeclList {$$=[$1].concat($2)}
    | Decl          {$$=[$1]} 
    ;

Decl
    : FuncDecl
    | EnumDecl
    | ThingDecl
    ;

ThingDecl
    : DEF THING TypeId NEWLINE INDENT MemberDecls DEDENT {$$=_ThingDecl($3,$6,[],this._$)}
    ;

MemberDecls
    : MemberDecl NEWLINE MemberDecls   {$$=[$1].concat($3)}
    | MemberDecl NEWLINE               {$$=[$1]}
    ;

MemberDecl 
    : MemberId TypeExpr {$$=_MemberId($1,$2)}
    ;

ThingAccess
    : Expr MemberId {$$=_ThingAccess($1,$2)}
    ;

ThingUpdate
    : Expr WITH NEWLINE INDENT MultilineMemberInits DEDENT {$$=_ThingUpdate($1,$5,this._$)}
    ;

EnumDecl
    : DEF ENUM TypeId NEWLINE INDENT Enums DEDENT {$$=_EnumDecl($3,$6,$3.location)}
    ;

Enums
    : EnumLit NEWLINE Enums {$$=[$1].concat($3)}
    | EnumLit NEWLINE       {$$=[$1]}
    ;

FuncDecl
    : NulliFuncDecl 
    | MonoFuncDecl
    | BiFuncDecl
    | PolyFuncDecl
    ;

NulliFuncDecl
    : DEF FuncId ReturnDecl Block {$$=_FuncDecl([$2],$3,[],$4,"Nulli");}
    ;

MonoFuncDecl
    : DEF ParamDecl FuncId ReturnDecl Block {$$=_FuncDecl([$3],$4,[$2],$5,"Nulli");}

    /*Unary-prefix-operator*/ 
    | DEF ParamDecl OpId ReturnDecl Block   {$$=_FuncDecl([$3],$4,[$2],$5,"Nulli");} 

    /*Unary-postfix-operator*/
    | DEF OpId ParamDecl ReturnDecl Block   {$$=_FuncDecl([$2],$4,[$3],$5,"Nulli");}
    ;

BiFuncDecl
    : DEF ParamDecl FuncId ParamDecl ReturnDecl Block {$$=_FuncDecl([$3],$5,[$2,$4],$6,"Bi")}
    | DEF ParamDecl OpId   ParamDecl ReturnDecl Block {$$=_FuncDecl([$3],$5,[$2,$4],$6,"Bi")}
    ;

PolyFuncDecl
    : DEF ParamDecl FuncId ParamDecl PolyFuncDeclTail ReturnDecl Block {
        $$=_FuncDecl([$3],$6,[$2,$4],$7,"Poly");
        $$.signature  = $$.signature.concat($5[0]);
        $$.parameters = $$.parameters.concat($5[1]);
    }
    ;

PolyFuncDeclTail
    : SubFuncId ParamDecl PolyFuncDeclTail {
        $3[0].push($1);
        $3[1].push($2);
        $$=$3;
    }
    | SubFuncId ParamDecl {$$=[[$1],[$2]]}
    ;

ParamDecl
    : VarId TypeExpr {$$=_VarDecl($1,$2)}
    ;   

ReturnDecl
    : /* nothing , means no need to return anything*/ {$$=null;}
    | Arrow TypeExpr {$$=$2}
    ;

TypeExpr
    : TypeId {$$=_UnresolvedType($1,[],false)}
    ;

Block
    : NEWLINE INDENT Stmts DEDENT {$$=$3}
    | NEWLINE INDENT EmbeddedJavascript NEWLINE DEDENT {$$=[$3]}
    ;

Stmts
    : Stmt Stmts {$$=[$1].concat($2)}
    | Stmt       {$$=[$1]}
    ;

Stmt 
    : Expr NEWLINE {$$=$1;}
    | ReturnStmt
    | AssignStmt
    ;

AssignStmt
    : LET VarDecl EqualSign MultilineExpr   {$$=_AssignStmt($2,true,$4)}
    | VarId EqualSign MultilineExpr        {$$=_AssignStmt($1,false,$3)}
    ;

MultilineExpr
    : Expr NEWLINE
    | MultilineThing
    | ThingUpdate
    ;

MultilineThing
    : TypeExpr NEWLINE INDENT MultilineMemberInits DEDENT {$$=_ThingExpr($1,$4)}
    ;

MultilineMemberInits
    : MultilineMemberInit MultilineMemberInits {$$=[$1].concat($2)}
    | MultilineMemberInit {$$=[$1]}
    ;

MultilineMemberInit
    : MemberId EqualSign MultilineExpr {$$=_KeyValue($1,$3)}
    ;

VarDecl 
    : VarId                    {$$=_VarDecl($1,null)}
    | MUTABLE VarId            {$$=_VarDecl($2,null,true)}
    | VarId TypeExpr           {$$=_VarDecl($1,$2)}
    | MUTABLE VarId TypeExpr   {$$=_VarDecl($2,$3,true)}
    ;


ReturnStmt
    : RETURN Expr NEWLINE {$$=_ReturnStmt($2,this._$)}
    ;

FuncCall
    : NulliFuncCall 
    | MonoFuncCall  
    | BiFuncCall    
    | PolyFuncCall   
    ;

NulliFuncCall
    : FuncId {$$=_FuncCall("Nulli",[$1],[],this._$)}
    ;

MonoFuncCall
    : Expr FuncId      {$$=_FuncCall("Mono",[$2],[$1],this._$)}
    | Expr OpId        {$$=_FuncCall("Mono",[$2],[$1],this._$)}
    | OpId AtomicExpr  {$$=_FuncCall("Mono",[$1],[$2],this._$)}
    ;

BiFuncCall
    : Expr FuncId AtomicExpr {$$=_FuncCall("Bi",[$2],[$1,$3],this._$)}
    | Expr OpId   AtomicExpr {$$=_FuncCall("Bi",[$2],[$1,$3],this._$)}
    ;

PolyFuncCall 
    : Expr FuncId AtomicExpr PolyFuncCallTail {
        $$=_FuncCall("Poly",[$2],[$1,$3],this._$);
        $$.signature  = $$.signature.concat($4[0]);
        $$.parameters = $$.parameters.concat($4[1]);
    }
    ;

PolyFuncCallTail
    : SubFuncId AtomicExpr PolyFuncCallTail {
        $3[0].push($1);
        $3[1].push($2);
        $$=$3;
    }
    | SubFuncId AtomicExpr {$$=[[$1],[$2]]}
    ;

AtomicExpr 
    : NumberLit
    | StringLit
    | VarId
    | LeftParenthesis Expr RightParenthesis {$$=$2;}
    ;

Expr
    : FuncCall
    | AtomicExpr
    | ThingAccess
    ;

FuncId
    : FUNC_ID {$$=_Token($1, this._$)}
    ;

SubFuncId
    : SUBFUNC_ID {$$=_Token($1, this._$)}
    ;

TypeId
    : TYPE_ID {$$=_Token($1, this._$)}
    ;

VarId
    : VAR_ID {$$=_Token($1, this._$); $$.kind="Variable";}
    ;

OpId
    : OP_ID {$$=_Token($1, this._$)}
    ;

MemberId
    : MEMBER_ID {$$=_Token($1,this._$)}
    ;

EmbeddedJavascript
    : JAVASCRIPT {$$=_JavascriptCode($1, this._$)}
    ;

StringLit
    : STRINGLIT {$$=_StringExpression($1, this._$)}
    ;

NumberLit
    : NUMBERLIT {$$=_NumberExpression($1, this._$)}
    ;

EnumLit
    : ENUMLIT {$$=_EnumExpression($1, this._$)}
    ;
