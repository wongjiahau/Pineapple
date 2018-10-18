// This jison file is to prove that Pineapple function call can be done without parentheseses
/* description: Parses and executes mathematical expressions. */
%{
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

/*
Abbreviations:
Decl    Declaration
Func    Function 
Expr    Expression
Op      Operator
*/

EntryPoint
    : DeclarationList EOF {return $1}
    | SinglelineExpr EOF {return $1} // This is for String Interpolation only, not for other uses. Maybe REPL can use this
    ;

FuncCall
    : NulliFuncCall 
    | MonoFuncCall  
    | BiFuncCall    
    | PolyFuncCall   
    ;

NulliFuncCall
    : FuncAtom
    ;

MonoFuncCall
    : AtomicExpr FuncAtom
    | AtomicExpr OpAtom
    | OpAtom AtomicExpr
    ;

BiFuncCall
    : AtomicExpr FuncAtom AtomicExpr
    | AtomicExpr OpAtom   AtomicExpr
    ;

PolyFuncCall 
    : AtomicExpr FuncAtom AtomicExpr PolyFuncCallTail
    ;

PolyFuncCallTail
    : VariableAtom AtomicExpr PolyFuncCallTail
    | VariableAtom AtomicExpr
    ;

AtomicExpr 
    : NumberAtom
    | FuncCall
    | VariableAtom
    | LeftParenthesis AtomicExpr RightParenthesis {$$=$2;}
    ;
