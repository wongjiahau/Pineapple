// Abstract Syntax Tree Node Interfaces
export interface LinkedNode<T> {
    current: T;
    next: LinkedNode<T> | null;
}

export type Declaration
    = FunctionDeclaration
    | StructDeclaration
    | ImportDeclaration
    // | InterfaceDeclaration
    // | EnumDeclaration
    // | ImplementionDeclaration
    ;

export interface FunctionDeclaration {
    kind: "FunctionDeclaration";
    affix: FunctionAffix;
    signature: AtomicToken[];
    returnType: TypeExpression;
    parameters: VariableDeclaration[];
    statements: LinkedNode<Statement>;
}

export interface StructDeclaration {
    kind: "StructDeclaration";
    name: AtomicToken;
    members: LinkedNode<MemberDefinition>;
}

export interface MemberDefinition {
    name: AtomicToken;
    expectedType: TypeExpression;
}

export type Statement
    = AssignmentStatement
    | FunctionCall
    | JavascriptCode
    | ReturnStatement
    | BranchStatement
    | ForStatement
    | WhileStatement
    | PassStatement
    ;

export interface ImportDeclaration {
    kind: "ImportDeclaration";
    filename: StringExpression;
}

export interface PassStatement {
    kind: "PassStatement";
}

export interface WhileStatement {
    kind: "WhileStatement";
    test: TestExpression;
    body: LinkedNode<Statement>;
}

export interface ForStatement {
    kind: "ForStatement";
    iterator: Variable;
    expression: Expression;
    body: LinkedNode<Statement>;
}

export interface BranchStatement {
    kind: "BranchStatement";
    test: TestExpression;
    body: LinkedNode<Statement>;
    elseBranch: BranchStatement;
}

export interface TestExpression {
    kind: "TestExpression";
    current: FunctionCall;
    negated: boolean;
    chainOperator: AtomicToken;
    next: TestExpression;
}

export interface ReturnStatement {
    kind: "ReturnStatement";
    expression: Expression;
}

export interface AssignmentStatement {
    kind: "AssignmentStatement";
    variable: Variable | VariableDeclaration;
    isDeclaration: boolean;
    isMutable: boolean;
    expression: Expression;
}

export type TypeExpression
    = SimpleType
    | CompoundType
    | FunctionType
    | GenericType
    | StructDeclaration
    ;

export interface SimpleType {
    kind: "SimpleType";
    name: AtomicToken;
    nullable: boolean;
}

export interface CompoundType {
    kind: "CompoundType";
    name: AtomicToken;
    of: LinkedNode<TypeExpression>;
    nullable: boolean;
}

export interface GenericType {
    kind: "GenericType";
    placeholder: AtomicToken; // "T" | "T1" | "T2";
    nullable: boolean;
}

export interface FunctionType {
    kind: "FunctionType";
    inputType: TypeExpression[];
    outputType: TypeExpression;
}

export type Expression
    = FunctionCall
    | StringExpression
    | NumberExpression
    | BooleanExpression
    | Variable
    | ObjectExpression // Pineapple Object Notation (PON)
    | ListExpression // a.k.a. Array
    | ListAccess
    | CurriedFunc
    // | MonoExpression
    ;

export type CurriedFunc
    = CurriedMonoFunc
    | CurriedOperatorFunc
    // | CurriedBiFunc
    // | CurriedTriFunc
    ;

export interface CurriedOperatorFunc {
    kind: "CurriedOperatorFunc";
    leftOperand: Expression | null;
    signature: AtomicToken[];
    rightOperand: Expression | null;
    returnType: TypeExpression;
}

export interface CurriedMonoFunc {
    kind: "CurriedMonoFunc";
    signature: AtomicToken[];
    returnType: TypeExpression;
}

export type FunctionAffix = "nofix" | "prefix" | "suffix" | "infix" | "mixfix";

export interface FunctionCall {
    kind: "FunctionCall";
    fix: FunctionAffix;
    signature: AtomicToken[];
    parameters: Expression[];
    returnType: TypeExpression;
    location: TokenLocation;
}

export interface ListAccess {
    kind: "ListAccess";
    subject: Expression;
    index: Expression;
    returnType: TypeExpression;
}

export interface VariableDeclaration {
    kind: "VariableDeclaration";
    variable: Variable;
    typeExpected: TypeExpression; // This info is captured by parser
}

export interface Variable extends AtomicToken {
    kind: "Variable";
    returnType: TypeExpression; // This info should be fill in by type checker
}

export interface ObjectExpression { // NOTE: Object is also Dictionary
    kind: "ObjectExpression";
    constructor: AtomicToken | null;
    keyValueList: LinkedNode<KeyValue>;
    returnType: TypeExpression;
}

export interface KeyValue {
    memberName: AtomicToken;
    expression: Expression;
}

export interface ListExpression {
    kind: "List";
    elements: LinkedNode<Expression> | null;
    location: TokenLocation;
    returnType: TypeExpression;
}

export interface StringExpression extends AtomicToken {
    kind: "String";
    repr: string;
    returnType: TypeExpression;
}

export interface NumberExpression extends AtomicToken {
    kind: "Number";
    returnType: TypeExpression;
}

export interface BooleanExpression extends AtomicToken {
    kind: "Boolean";
    returnType: TypeExpression;
}

export interface JavascriptCode extends AtomicToken {
    kind: "JavascriptCode";
}

export interface AtomicToken {
    repr: string; // shorthand for representation
    location: TokenLocation | null;
}

export interface TokenLocation {
    first_line: number;
    last_line: number;
    first_column: number;
    last_column: number;
}
