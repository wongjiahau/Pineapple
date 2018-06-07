// Abstract Syntax Tree Node Interfaces
export interface Declaration {
    kind: "Declaration";
    body: FunctionDeclaration;
    next: Declaration;
}

export interface FunctionDeclaration {
    kind: "FunctionDeclaration";
    fix: "nofix" | "prefix" | "suffix" | "infix" | "mixfix";
    signature: TokenAtom;
    returnType: TypeExpression;
    parameters: Variable[];
    statements: Statement;
}

export interface Statement {
    body: LinkStatement | FunctionCall | JavascriptCode;
    next: Statement;
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
    name: TokenAtom;
    isList: boolean;
    listSize: Expression;
    // tuple: TupleTypeExpression;
    operator: "union" | "intersect";
    next: TypeExpression;
}

export type Expression
    = FunctionCall
    | StringExpression
    | Variable
    // | Pon // Pineapple Object Notation (PON)
    // | MonoExpression
    ;

export type FunctionFix = "nofix" | "prefix" | "suffix" | "infix" | "mixfix";

export interface FunctionCall {
    kind: "FunctionCall";
    fix: FunctionFix;
    signature: TokenAtom;
    parameters: Expression[];
}

export interface Variable {
    kind: "Variable";
    name: TokenAtom;
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
    kind: "String";
    value: TokenAtom;
}

export interface JavascriptCode {
    kind: "JavascriptCode";
    value: TokenAtom;
}

export interface TokenAtom {
    token: {
        type: string;
        id: number;
        line: number;
        column: number;
        value: string;
    };
}
