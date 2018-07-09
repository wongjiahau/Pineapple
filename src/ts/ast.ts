// Abstract Syntax Tree Node Interfaces
export interface Declaration {
    kind: "Declaration";
    body: FunctionDeclaration;
    next: Declaration | null;
}

export interface FunctionDeclaration {
    kind: "FunctionDeclaration";
    affix: FunctionAffix;
    signature: Token[];
    returnType: TypeExpression;
    parameters: Variable[];
    statements: Statement;
}

export interface Statement {
    body: LinkStatement | FunctionCall | JavascriptCode;
    next: Statement | null;
}

export interface LinkStatement {
    kind: "LinkStatement";
    isDeclaration: boolean;
    variable: Variable;
    linkType: "bind" | "assign";
    expression: Expression;
}

export type TypeExpression
    = SimpleType
    | ListType
    ;

export interface SimpleType {
    kind: "SimpleType";
    name: Token;
    nullable: boolean;
}

export interface ListType {
    kind: "ListType";
    nullable: boolean;
    listOf: TypeExpression;
}

export type Expression
    = FunctionCall
    | StringExpression
    | NumberExpression
    | BooleanExpression
    | Variable
    | PonExpression // Pineapple Object Notation (PON)
    | ListExpression // a.k.a. Array
    // | MonoExpression
    ;

export type FunctionAffix = "nofix" | "prefix" | "suffix" | "infix" | "mixfix";

export interface FunctionCall {
    kind: "FunctionCall";
    fix: FunctionAffix;
    signature: Token[];
    parameters: Expression[];
    returnType: TypeExpression;
}

export interface Variable {
    kind: "Variable";
    name: Token;
    typeExpected: TypeExpression; // This info is captured by parser
    returnType: TypeExpression; // This info should be fill in by type checker
    value: Expression;
}

export interface PonExpression {
    kind: "Pon";
    keyValueList: KeyValueList;
    returnType: TypeExpression;
}

export interface KeyValueList {
    keyValue: KeyValue;
    next: KeyValueList | null;
}

export interface KeyValue {
    memberName: Token;
    expression: Expression;
}

export interface ListExpression {
    kind: "List";
    elements: ListElement;
    returnType: TypeExpression;
}

export interface ListElement {
    kind: "ListElement";
    value: Expression;
    next: ListElement | null;
}

export interface StringExpression extends Token {
    kind: "String";
    value: string;
    returnType: TypeExpression;
}

export interface NumberExpression extends Token {
    kind: "Number";
    returnType: TypeExpression;
}

export interface BooleanExpression extends Token {
    kind: "Boolean";
    returnType: TypeExpression;
}

export interface JavascriptCode {
    kind: "JavascriptCode";
    value: string;
}

export interface Token {
    value: string;
    location: TokenLocation | null;
}

export interface TokenLocation {
    first_line: number;
    last_line: number;
    first_column: number;
    last_column: number;
}
