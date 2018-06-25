// Abstract Syntax Tree Node Interfaces
export interface Declaration {
    kind: "Declaration";
    body: FunctionDeclaration;
    next: Declaration | null;
}

export interface FunctionDeclaration {
    kind: "FunctionDeclaration";
    affix: FunctionAffix;
    signature: string;
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

export interface TypeExpression {
    kind: "TypeExpression";
    name: string;
    isList: boolean;
    listSize: Expression | null;
    or: TypeExpression | null;
    and: TypeExpression | null;
    // tuple: TupleTypeExpression;
}

export type Expression
    = FunctionCall
    | StringExpression
    | NumberExpression
    | Variable
    // | Pon // Pineapple Object Notation (PON)
    // | MonoExpression
    ;

export type FunctionAffix = "nofix" | "prefix" | "suffix" | "infix" | "mixfix";

export interface FunctionCall {
    kind: "FunctionCall";
    fix: FunctionAffix;
    signature: string;
    parameters: Expression[];
    returnType: TypeExpression;
}

export interface Variable {
    kind: "Variable";
    name: string;
    typeExpected: TypeExpression; // This info is captured by parser
    returnType: TypeExpression; // This info should be fill in by type checker
    value: Expression;
}

export interface Pon {
    kind: "Pon";
    keyValueList: KeyValue;
}

export interface KeyValue {
    memberName: string;
    expression: Expression;
    next: KeyValue;
}

export interface StringExpression {
    kind: "String";
    value: string;
    returnType: TypeExpression;
}

export interface NumberExpression {
    kind: "Number";
    value: string;
    returnType: TypeExpression;
}

export interface JavascriptCode {
    kind: "JavascriptCode";
    value: string;
}
