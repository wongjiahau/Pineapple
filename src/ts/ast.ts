// Abstract Syntax Tree Node Interfaces
export interface LinkedNode<T> {
    current: T;
    next: LinkedNode<T> | null;
}

export type Declaration
    = FunctionDeclaration
    | StructDeclaration
    | ImportDeclaration
    | EnumDeclaration
    // TODO: To be implemented soon
    // | InterfaceDeclaration
    // | ImplementionDeclaration
    ;

export interface FunctionDeclaration {
    kind: "FunctionDeclaration";
    affix: FunctionAffix;
    signature: AtomicToken[];
    returnType: TypeExpression;
    parameters: VariableDeclaration[];
    statements: LinkedNode<Statement>;
    originFile: string;
}

export interface StructDeclaration {
    kind: "StructDeclaration";
    name: AtomicToken;
    members: LinkedNode<MemberDefinition> | null;
    templates: LinkedNode<TypeExpression> | null;
    location: TokenLocation;
    nullable: boolean;
    originFile: string;
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
    originFile: string;
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
    location: TokenLocation;
}

export interface AssignmentStatement {
    kind: "AssignmentStatement";
    variable: Variable | VariableDeclaration;
    isDeclaration: boolean;
    expression: Expression;
}

export type TypeExpression
    = SimpleType
    | GenericType
    | StructDeclaration
    | VoidType
    | EnumDeclaration
    ;

export interface EnumDeclaration {
    kind: "EnumDeclaration";
    name: AtomicToken;
    enums: LinkedNode<AtomicToken>;
    location: TokenLocation;
    nullable: boolean;
    originFile: string;
}

export interface EnumExpression {
    kind: "EnumExpression";
    value: AtomicToken;
    returnType: EnumDeclaration;
    location: TokenLocation;
}

export interface VoidType {
    kind: "VoidType";
    location: TokenLocation;
    nullable: boolean;
}

export interface SimpleType {
    kind: "SimpleType";
    name: AtomicToken;
    nullable: boolean;
    location: TokenLocation;
}

export interface GenericType {
    kind: "GenericType";
    placeholder: AtomicToken; // "T" | "T1" | "T2";
    nullable: boolean;
    location: TokenLocation;
}

export type Expression
    = FunctionCall
    | StringExpression
    | NumberExpression
    | EnumExpression
    | Variable
    | ObjectExpression // Pineapple Object Notation (PON)
    | ObjectAccess
    | ListExpression // a.k.a. Array
    | TupleExpression // a.k.a. Array
    | AnonymousExpression
    | Lambda
    ;

export interface TupleExpression {
    kind: "TupleExpression";
    elements: LinkedNode<Expression>;
    location: TokenLocation;
    returnType: TypeExpression;
}

export interface AnonymousExpression {
    kind: "AnonymousExpression";
    position: 0 | 1 | 2 | 3 | 4 | 5;
    location: TokenLocation;
    returnType: TypeExpression;
}

export interface Lambda {
    kind: "Lambda";
    returnType: TypeExpression;
    location: TokenLocation;
    // placeholders: //TODO: Complete this
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

export interface VariableDeclaration {
    kind: "VariableDeclaration";
    variable: Variable;
    isMutable: boolean;
    typeExpected: TypeExpression; // This info is captured by parser
}

export interface Variable extends AtomicToken {
    kind: "Variable";
    isMutable: boolean;
    returnType: TypeExpression; // This info should be fill in by type checker
}

export interface ObjectExpression { // NOTE: Object is also Dictionary
    kind: "ObjectExpression";
    constructor: AtomicToken | null;
    keyValueList: LinkedNode<KeyValue> | null;
    returnType: TypeExpression;
    location: TokenLocation;
}

export interface KeyValue {
    memberName: AtomicToken;
    expression: Expression;
}

export interface ObjectAccess {
    kind: "ObjectAccess";
    subject: Expression;
    key: AtomicToken;
    returnType: TypeExpression;
    location: TokenLocation;
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

export interface JavascriptCode extends AtomicToken {
    kind: "JavascriptCode";
}

export interface AtomicToken {
    repr: string; // shorthand for representation
    location: TokenLocation;
}

export interface TokenLocation {
    first_line: number;
    last_line: number;
    first_column: number;
    last_column: number;
}

export function NullTokenLocation(): TokenLocation {
    return {
        first_column: -1,
        first_line: -1,
        last_column: -1,
        last_line: -1,
    };
}

export function singleLinkedNode<T>(current: T): LinkedNode<T> {
    return {
        current: current,
        next: null
    };
}

export function newGenericType(placeholder: string): GenericType {
    return {
        kind: "GenericType",
        placeholder: newAtomicToken(placeholder),
        location: NullTokenLocation(),
        nullable: false
    };
}

export function newAtomicToken(repr: string): AtomicToken {
    return {
        repr: repr,
        location: NullTokenLocation()
    };
}

export function newSimpleType(name: string): TypeExpression {
    return {
        kind: "SimpleType",
        name: {
            repr: name,
            location: NullTokenLocation()
        },
        nullable: false,
        location: NullTokenLocation()
    };
}
