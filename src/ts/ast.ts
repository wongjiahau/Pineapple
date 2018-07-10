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
    body
        : AssignmentStatement
        | FunctionCall
        | JavascriptCode
        | ReturnStatement
        | BranchStatement
        | ForStatement
        ;

    next
        : Statement
        | null
        ;
}

export interface ForStatement {
    kind: "ForStatement";
    iterator: Variable;
    expression: Expression;
    body: Statement;
}

export interface BranchStatement {
    kind: "BranchStatement";
    test: TestExpression;
    body: Statement;
    elseBranch: BranchStatement;
}

export interface TestExpression {
    kind: "TestExpression";
    current: FunctionCall;
    negated: boolean;
    chainOperator: Token;
    next: TestExpression;
}

export interface ReturnStatement {
    kind: "ReturnStatement";
    expression: Expression;
}

export interface AssignmentStatement {
    kind: "AssignmentStatement";
    isDeclaration: boolean;
    variable: Variable;
    linkType: "bind" | "assign";
    expression: Expression;
}

export type TypeExpression
    = SimpleType
    | ArrayType
    ;

export interface SimpleType {
    kind: "SimpleType";
    name: Token;
    nullable: boolean;
}

export interface ArrayType {
    kind: "ArrayType";
    nullable: boolean;
    arrayOf: TypeExpression;
}

export type Expression
    = FunctionCall
    | StringExpression
    | NumberExpression
    | BooleanExpression
    | Variable
    | PonExpression // Pineapple Object Notation (PON)
    | ArrayExpression // a.k.a. Array
    | ArrayAccess
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

export interface ArrayAccess {
    kind: "ArrayAccess";
    subject: Expression;
    index: Expression;
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

export interface ArrayExpression {
    kind: "Array";
    elements: ArrayElement;
    returnType: TypeExpression;
}

export interface ArrayElement {
    kind: "ArrayElement";
    value: Expression;
    next: ArrayElement | null;
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
