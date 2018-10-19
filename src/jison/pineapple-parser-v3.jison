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
    Sym     Symbol 
    Lit     Literal
    Var     Variable
    Param   Parameter of Function 
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

const _ReturnStatement = (expression,location) => ({ kind: "ReturnStatement", expression, location});

const _VariableDeclaration = (variable, typeExpected, isMutable=false) => ({
    kind: "VariableDeclaration",
    variable,
    typeExpected,
    isMutable
});

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

// Custom OPSYM literals that might overlap with built-in symbols
[=.<>][-!$%^&*_+|~=`;<>.\/]+ return 'OPSYM'

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
["].*?["]                                   return 'STRINGLIT'
\<javascript\>(.|[\s\S])*?\<\/javascript\>  return 'JAVASCRIPT'
\d+([.]\d+)?((e|E)[+-]?\d+)?                return 'NUMBERLIT' 
[#][a-zA-Z0-9]+                             return 'ENUMLIT'

// Identifiers
[.]([a-z][a-zA-Z0-9]*)?         return 'FUNCSYM'    
\b[T][12]?\b                    return 'GENERICTYPENAME'
[:][a-z][a-zA-Z0-9]*            return 'TYPESYM'
[a-z][a-zA-Z0-9]*               return 'VARSYM'
['][a-z][a-zA-Z0-9]*            return 'MEMBERNAME'
[-!$%^&*_+|~=`;<>\/]+           return 'OPSYM'

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
    ;

EnumDecl
    : DEF ENUM TypeSym NEWLINE INDENT Enums DEDENT {$$=_EnumDecl($3,$6,$3.location)}
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
    : DEF FuncSym ReturnDecl Block {$$=_FuncDecl([$2],$3,[],$4,"Nulli");}
    ;

MonoFuncDecl
    : DEF ParamDecl FuncSym ReturnDecl Block {$$=_FuncDecl([$3],$4,[$2],$5,"Nulli");}

    /*Unary-prefix-operator*/ 
    | DEF ParamDecl OpSym ReturnDecl Block   {$$=_FuncDecl([$3],$4,[$2],$5,"Nulli");} 

    /*Unary-postfix-operator*/
    | DEF OpSym ParamDecl ReturnDecl Block   {$$=_FuncDecl([$2],$4,[$3],$5,"Nulli");}
    ;

BiFuncDecl
    : DEF ParamDecl FuncSym ParamDecl ReturnDecl Block {$$=_FuncDecl([$3],$5,[$2,$4],$6,"Bi")}
    | DEF ParamDecl OpSym   ParamDecl ReturnDecl Block {$$=_FuncDecl([$3],$5,[$2,$4],$6,"Bi")}
    ;

PolyFuncDecl
    : DEF ParamDecl FuncSym ParamDecl PolyFuncDeclTail ReturnDecl Block {
        $$=_FuncDecl([$3],$6,[$2,$4],$7,"Poly");
        $$.signature  = $$.signature.concat($5[0]);
        $$.parameters = $$.parameters.concat($5[1]);
    }
    ;

PolyFuncDeclTail
    : VarSym ParamDecl PolyFuncDeclTail {
        $3[0].push($1);
        $3[1].push($2);
        $$=$3;
    }
    | VarSym ParamDecl {$$=[[$1],[$2]]}
    ;

ParamDecl
    : VarSym TypeExpr {$$=_VariableDeclaration($1,$2)}
    ;   

ReturnDecl
    : /* nothing , means no need to return anything*/ {$$=null;}
    | Arrow TypeExpr {$$=$2}
    ;

TypeExpr
    : TypeSym {$$=_UnresolvedType($1,[],false)}
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
    : FuncCall NEWLINE {$$=$1;}
    | ReturnStmt
    ;

ReturnStmt
    : RETURN Expr NEWLINE {$$=_ReturnStatement($2,this._$)}
    ;

FuncCall
    : NulliFuncCall 
    | MonoFuncCall  
    | BiFuncCall    
    | PolyFuncCall   
    ;

NulliFuncCall
    : FuncSym {$$=_FuncCall("Nulli",[$1],[],this._$)}
    ;

MonoFuncCall
    : Expr FuncSym      {$$=_FuncCall("Mono",[$2],[$1],this._$)}
    | Expr OpSym        {$$=_FuncCall("Mono",[$2],[$1],this._$)}
    | OpSym AtomicExpr  {$$=_FuncCall("Mono",[$1],[$2],this._$)}
    ;

BiFuncCall
    : Expr FuncSym AtomicExpr {$$=_FuncCall("Bi",[$2],[$1,$3],this._$)}
    | Expr OpSym   AtomicExpr {$$=_FuncCall("Bi",[$2],[$1,$3],this._$)}
    ;

PolyFuncCall 
    : Expr FuncSym AtomicExpr PolyFuncCallTail {
        $$=_FuncCall("Poly",[$2],[$1,$3],this._$);
        $$.signature  = $$.signature.concat($4[0]);
        $$.parameters = $$.parameters.concat($4[1]);
    }
    ;

PolyFuncCallTail
    : VarSym AtomicExpr PolyFuncCallTail {
        $3[0].push($1);
        $3[1].push($2);
        $$=$3;
    }
    | VarSym AtomicExpr {$$=[[$1],[$2]]}
    ;

AtomicExpr 
    : NumberLit
    | StringLit
    | VarSym
    | LeftParenthesis Expr RightParenthesis {$$=$2;}
    ;

Expr
    : FuncCall
    | AtomicExpr
    ;

FuncSym
    : FUNCSYM {$$=_Token($1, this._$)}
    ;

TypeSym
    : TYPESYM {$$=_Token($1, this._$)}
    ;

VarSym
    : VARSYM {$$=_Token($1, this._$); $$.kind="Variable";}
    ;

OpSym
    : OPSYM {$$=_Token($1, this._$)}
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