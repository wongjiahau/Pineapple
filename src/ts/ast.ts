// Abstract Syntax Tree Node Interfaces
export interface Declaration {
    body: FunctionDeclaration;
    next: Declaration;
}

export interface FunctionDeclaration {
    kind: "FunctionDeclaration";
    signature: string;
    returnType: TypeExpression;
    parameters: Parameter[];
    statements: Statement;
    next: Declaration;
}

export interface Statement {
    body: LinkStatement | FunctionCall;
    next: Statement;
}

export interface LinkStatement {
    kind: "LinkStatement";
    variable: Variable;
    linkType: "bind" | "assign";
    expression: Expression;
}

export interface Parameter {
    type: TypeExpression;
    name: string;
}

export interface TypeExpression {
    name: string;
    isList: boolean;
    listSize: Expression;
    // tuple: TupleTypeExpression;
    operator: "union" | "intersect";
    next: TypeExpression;
}

export type Expression
    = FunctionCall
    | StringExpression
    | Pon // Pineapple Object Notation (PON)
    // | MonoExpression
    ;

export interface FunctionCall {
    kind: "FunctionCall";
    fix: "nofix" | "prefix" | "suffix" | "infix" | "mixfix";
    signature: string;
    parameters: Variable[];
}

export interface Variable {
    kind: "Variable";
    name: string;
    type: TypeExpression;
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
    value: string;
}
