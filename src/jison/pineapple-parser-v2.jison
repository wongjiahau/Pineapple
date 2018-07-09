
/* description: Parses and executes mathematical expressions. */
%{
const _Declaration     = (body,next)  => ({body,next});

const _Statement       = (body,next)  => ({body,next});

const _ReturnStatement = (expression) => ({ kind: "ReturnStatement", expression});

const _FunctionDeclaration = (signature,returnType,parameters,statements,affix) => ({
    kind: "FunctionDeclaration",
    signature,
    returnType, 
    parameters, 
    statements, 
    affix,
});

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

const _AssignmentStatement = (variable, linkType, expression, isDeclaration) => ({
    kind: "AssignmentStatement",
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

const _SimpleType = (name, nullable) => ({ kind: "SimpleType", name, nullable});

const _ArrayType = (typeExpr, nullable) => ({
    kind: "ArrayType",
    nullable,
    arrayOf: typeExpr,
});

const _FunctionCall = (fix,signature,parameters) => ({
    kind: "FunctionCall",
    fix,
    signature,
    parameters,
});

const _Pon = (keyValue) => ({
    kind: "Pon",
    keyValueList: keyValue
});

const _KeyValueList = (keyValue, next) => ({keyValue, next});

const _KeyValue = (memberName, expression) => ({
    memberName,
    expression,
});

const _ArrayExpression = (elements) => ({ kind: "Array", elements });

const _ArrayElement = (value,next) => ({ kind: "ArrayElement", value, next});

const _StringExpression = (value, location) => ({kind:"String", value, location});

const _NumberExpression = (value, location) => ({kind:"Number", value, location});

const _BooleanExpression = (value, location) => ({kind:"Boolean", value, location});

const _JavascriptCode = (token) => ({kind:"JavascriptCode",value:token});

const _Token = (value, location) => ({value, location});

function _getOperatorName(op) {
    const dic = {
        "+"  : "plus",           "&"	: "ampersand",      "'"	: "apostrophe",
        "*"	 : "asterisk",       "@"	: "at",             "`"	: "backtick",
        "\\" : "backslash",      ":"	: "colon",          ","	: "comma",
        "$"	 : "dollar",         "="	: "equal",          "!"	: "bang",
        ">"	 : "greaterThan",    "<"	: "lessThan",       "–"	: "minus",
        "%"	 : "percent",        "|"	: "pipe",           "+"	: "plus",
        "#"	 : "hash",           ";"	: "semi",           "/"	: "slash",
        "~"	 : "tilde",          "_"	: "underscore",     "?"	: "questionMark",
        "."	 : "period",
    };
    let result = "$" + op.split("").map(x => dic[x]).join("$") + ":";
    return result;
}
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
"->"    return '->'
"="     return 'ASSIGN_OP'
"("     return 'LEFT_PAREN' 
")"     return 'RIGHT_PAREN'
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
[a-z][a-zA-Z0-9]*[:]            return 'FUNCNAME'    
[A-Z][a-zA-Z0-9]*               return 'TYPENAME'
[a-z][a-zA-Z]*                  return 'VARNAME'
[.][a-z][a-zA-Z]*               return 'MEMBERNAME'
[-!$%^&*_+|~=`\[\]:";'<>?,.\/]+ return 'OPERATOR'



"::"                 return '::'
"["                  return '['
"]"                  return ']'
","                  return  COMMA
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
    : DEF NofixFuncDeclaration  {$$=$2}
    | DEF PrefixFuncDeclaration {$$=$2}
    | DEF SuffixFuncDeclaration {console.log("suffix")}
    | DEF InfixFuncDeclaration  {$$=$2}
    | DEF MixfixFuncDeclaration {console.log("mixfix")}
    ;

InfixFuncDeclaration
    : Variable FuncAtom Variable '->' TypeExpression Block 
        {$$=_FunctionDeclaration([$2],$5,[$1,$3],$6,"infix")}
    | Variable LEFT_PAREN OperatorAtom RIGHT_PAREN Variable '->' TypeExpression Block
        {$$=_FunctionDeclaration([$3],$7,[$1,$5],$8,"infix")}
    ;

PrefixFuncDeclaration
    : FuncAtom Variable '->' TypeExpression Block 
        {$$=_FunctionDeclaration([$1],$4,[$2],$5,"prefix")}
    | FuncAtom Variable Block {$$=_FunctionDeclaration([$1],null,[$2],$3,"prefix")}
    ;

SuffixFuncDeclaration
    : Variable FuncAtom '->' TypeExpression Block
    ;

NofixFuncDeclaration
    : FuncAtom '->' TypeExpression Block
        {$$=_FunctionDeclaration([$1],$3,[],$4,"nofix")}
    | FuncAtom Block {$$=_FunctionDeclaration([$1],null,[],$2,"nofix")}
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
    : RETURN Expression {$$=_ReturnStatement($2)}
    ;

ForStatement
    : FOR Variable IN Expression Block {$$=_ForStatement($2,$4,$5)}
    ;

WhileStatement
    : WHILE Test Block
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
    : FuncCall                                  {$$=_TestExpression($1,false,null,null)}
    | FuncCall LogicOperatorAtom Test           {$$=_TestExpression($1,false,$2,$3)}
    | NotAtom FuncCall                          {$$=_TestExpression($1,true,null,null)}
    | NotAtom FuncCall LogicOperatorAtom Test   {$$=_TestExpression($1,true,$2,$3)}
    ;

LinkStatement
    : LET Variable ASSIGN_OP Expression 
        {$$=_AssignmentStatement($2,$3,$4,true)}
    | LET Variable MUTABLE ASSIGN_OP Expression 
        // To be continued
    | VariableAtom ASSIGN_OP Expression 
        {$$=_AssignmentStatement(_Variable($1,null),$2,$3,false)}
    ;

Variable 
    : VariableAtom {$$=_Variable($1,null)}
    | VariableAtom TypeExpression {$$=_Variable($1,$2)}
    | LEFT_PAREN VariableAtom TypeExpression RIGHT_PAREN {$$=_Variable($2,$3)}
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
    | AtomicTypeExpr '[' Expression ']'
    | AtomicTypeExpr '[' TupleTypeExpression ']'
    | '(' TypeExpression ')'
    ;

TupleTypeExpression
    : TupleTypeExpression COMMA TypeExpression
    | TypeExpression
    ;


Expression
    : FuncCall
    | Object
    | MultilineList
    | AtomicExpr
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
    : InfixFuncCall FuncId AtomicExpr {$$=_FunctionCall("infix",[$2],[$1,$3])}
    | AtomicExpr FuncId AtomicExpr {$$=_FunctionCall("infix",[$2],[$1,$3])}
    ;

FuncId
    : FuncAtom
    | OperatorAtom
    ;

PrefixFuncCall
    : FuncAtom AtomicExpr {$$=_FunctionCall("prefix",[$1],[$2])}
    ;

SuffixFuncCall
    : AtomicExpr FuncAtom
    ;

MixfixFuncCall
    : FuncAtom AtomicExpr FuncAtom 
    | FuncAtom AtomicExpr FuncAtom AtomicExpr
    | FuncAtom AtomicExpr FuncAtom AtomicExpr FuncAtom
    | FuncAtom AtomicExpr FuncAtom AtomicExpr FuncAtom AtomicExpr
    | FuncAtom AtomicExpr FuncAtom AtomicExpr FuncAtom AtomicExpr FuncAtom
    | FuncAtom AtomicExpr FuncAtom AtomicExpr FuncAtom AtomicExpr FuncAtom AtomicExpr
    ;

AtomicExpr
    : LEFT_PAREN Expression RIGHT_PAREN {$$=$2}
    | Value
    | ArrayAccess
    | ArraySlicing
    | ObjectAccessExpr
    ;

ArrayAccess
    : AtomicExpr '.' '[' Expression ']'
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
    | ArrayList
    | BooleanAtom
    | StringAtom
    | NumberAtom
    | VariableAtom {$$=_Variable($1,null)}
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

ArrayList 
    : '[' Elements ']' {$$=_ArrayExpression($2)}
    | '[' ']' 
    ;

Elements
    : AtomicExpr {$$=_ArrayElement($1,null)}
    | AtomicExpr Elements  {$$=_ArrayElement($1,$2)}
    ;

MultilineList
    : NEWLINE INDENT MultilineElements DEDENT {$$=_ArrayExpression($3)}
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

VariableAtom
    : VARNAME {$$=_Token($1, this._$)} // Note: _$ means yyloc
    ;

MembernameAtom
    : MEMBERNAME {$$=_Token($1, this._$)}
    ;

OperatorAtom    
    : OPERATOR {$$=_Token(_getOperatorName($1), this._$)}
    ;

TypenameAtom
    : TYPENAME {$$=_Token($1, this._$)}
    ;

JavascriptCodeAtom
    : JAVASCRIPT {$$=_JavascriptCode($1)}
    ;

LogicOperatorAtom
    : AND {$$=_Token($1, this._$)}
    | OR  {$$=_Token($1, this._$)}
    ;
