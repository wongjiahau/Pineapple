export interface BinaryOperatorNode {
    kind: "BinaryOperator";
    left: ExpressionNode;
    right: ExpressionNode;
    operator: "+" | "*" | "-" | "/" | "%" | "^" | "<" | ">" | "<=" | ">=" | "==" | "!=";
}

export interface UnaryOperatorNode {
    kind: "UnaryOperator";
    operator: "+" | "-";
    inner: ExpressionNode;
}

export interface NumberNode {
    kind: "Number";
    value: number;
}

interface StringNode {
    kind: "String";
    value: string;
}

interface BooleanNode {
    kind: "Boolean";
    value: boolean;
}

interface NullNode {
    kind: "Null";
    value: null;
}

export interface BindingNode {
    kind: "Binding";
    variableNode: VariableNode;
    dataType: string | null;
    expression: ExpressionNode;
}

export interface AssignmentNode  {
    kind: "Assignment";
    variableNode: VariableNode;
    dataType: string | null;
    expression: ExpressionNode;
}

interface VariableNode {
    kind: "VariableName";
    name: string;
}

export interface ObjectNode {
    kind: "Object";
    memberNode: ObjectMemberNode;
}

export interface ObjectMemberNode {
    kind: "ObjectMember";
    name: string;
    dataType: string | null;
    expression: ExpressionNode;
    type: "assignment" | "binding";
    next: ObjectMemberNode | null;
}

export interface ObjectAccessNode {
    kind: "ObjectAccess";
    name: string;
    accessProperty: ObjectAccessNode;
}

interface ArrayNode {
    kind: "ArrayNode";
    element: ElementNode;
}

interface ArraySlicingNode {
    kind: "ArraySlicing";
    expr: ExpressionNode;
    start: ExpressionNode;
    end: ExpressionNode;
    excludeUpperBound: boolean;
}

export interface ArrayAccessNode {
    kind: "ArrayAccess";
    expr: ExpressionNode;
    index: ExpressionNode;
}

interface ElementNode {
    kind: "Element";
    expression: ExpressionNode;
    next: ElementNode;
}

export interface CompoundStatement {
    kind: "CompoundStatement";
    current: Statement;
    next: CompoundStatement;
}

export interface IfStatement {
    kind: "If";
    condition: ExpressionNode;
    body: CompoundStatement;
    else: ElifStatement | ElseStatement;
}

export interface ElifStatement {
    kind: "Elif";
    condition: ExpressionNode;
    body: CompoundStatement;
    else: ElifStatement | ElseStatement;
}

export interface ElseStatement {
    kind: "Else";
    body: CompoundStatement;
}

export interface ForStatement {
    kind: "For";
    iterator: VariableNode;
    items: ExpressionNode;
    body: CompoundStatement;
}

export type Statement
    = AssignmentNode
    | ExpressionNode
    | IfStatement
    | ElifStatement
    | ElseStatement
    | ForStatement
    ;

export type ExpressionNode
    = BinaryOperatorNode
    | UnaryOperatorNode
    | VariableNode
    | ArrayNode
    | ObjectNode
    | BindingNode
    | ValueNode
    | ObjectAccessNode
    | ArraySlicingNode
    | ArrayAccessNode
    ;

type ValueNode
    = NumberNode
    | StringNode
    | BooleanNode
    | NullNode
    ;

export function evalutateExpression(statement: CompoundStatement | Statement): any {
    if (statement.kind === "CompoundStatement") {
        const result = evalutateExpression(statement.current);
        if (statement.next !== null) {
            return evalutateExpression(statement.next);
        }
        return result;
    }
    switch (statement.kind) {
        case "If":
        case "Elif":
        case "Else":
            return evalIfStatement(statement);
        case "For":
            return evalForStatement(statement);
        case "Number":
        case "Boolean":
        case "Null":
        case "String":
            return statement.value;
        case "UnaryOperator":
            return evalUnaryOperatorNode(statement);
        case "BinaryOperator":
            return evalBinaryOperatorNode(statement);
        case "Assignment":
            return evalAssignmentNode(statement);
        case "Binding":
            return evalBindingNode(statement);
        case "VariableName":
            return evalVariableNode(statement);
        case "ArrayNode":
            return evalElementNode(statement.element);
        case "Object":
            return evalObjectMemberNode(statement.memberNode);
        case "ObjectAccess":
            return evalObjectAccessNode(statement);
        case "ArraySlicing":
            return evalArraySlicingNode(statement);
        case "ArrayAccess":
            return evalArrayAccess(statement);
    }
}

function evalUnaryOperatorNode(node: UnaryOperatorNode): string {
    const value = evalutateExpression(node.inner) as number;
    return `(${node.operator}${value})`;
}

function evalBinaryOperatorNode(node: BinaryOperatorNode): string {
    const leftValue = evalutateExpression(node.left) as number;
    const rightValue = evalutateExpression(node.right) as number;
    switch (node.operator) {
        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
        case ">":
        case "<":
        case "<=":
        case ">=":
            return `(${leftValue}${node.operator}${rightValue})`;
        case "^":  return `Math.pow(${leftValue},${rightValue})`;
        case "==": return `(${leftValue}===${rightValue})`;
        case "!=": return `(${leftValue}!==${rightValue})`;
    }
}

export const VARIABLES_TABLE: {[index: string]: {dataType: string, value: any}} = {};
function evalAssignmentNode(node: AssignmentNode): any {
    const exprValue = evalutateExpression(node.expression);
    VARIABLES_TABLE[node.variableNode.name] = {
        dataType: node.dataType,
        value: exprValue
    };
    return exprValue;
}

export const BINDINGS_TABLE: {[index: string]: {dataType: string, value: any}} = {};
function evalBindingNode(node: BindingNode): any {
    const exprValue = evalutateExpression(node.expression);
    BINDINGS_TABLE[node.variableNode.name] = {
        dataType: node.dataType,
        value: exprValue
    };
    return exprValue;
}

function evalVariableNode(node: VariableNode): number {
    let variable = VARIABLES_TABLE[node.name];
    if (variable) {
        return variable.value;
    }
    variable = BINDINGS_TABLE[node.name];
    if (variable) {
        return variable.value;
    }
    throw new Error(`No such variable: ${node.name}`);
}

function evalObjectMemberNode(node: ObjectMemberNode): object {
    if (node === null) {
        return {};
    }
    const result: {[index: string]: any} = {};
    // We slice one in order to get rid of the dot prefix
    result[node.name.trim().slice(1)] = evalutateExpression(node.expression);
    let next: ObjectMemberNode | null = node.next;
    while (next) {
        result[next.name.trim().slice(1)] = evalutateExpression(next.expression);
        next = next.next;
    }
    return result;
}

function evalElementNode(node: ElementNode): any[] {
    if (!node) {
        return [];
    }
    let result = [evalutateExpression(node.expression)];
    result = result.concat(evalElementNode(node.next));
    return result;
}

function evalObjectAccessNode(node: ObjectAccessNode): any {
    let variable = VARIABLES_TABLE[node.name];
    if (!variable) {
        variable = BINDINGS_TABLE[node.name];
        if (!variable) { throw Error("No such variable: " + node.name); }
    }
    let value = variable.value[node.accessProperty.name];
    let currentNode = node.accessProperty.accessProperty;
    while (true) {
        if (currentNode === null) {
            return value;
        }
        value = value[currentNode.name];
        currentNode = currentNode.accessProperty;
    }
}

function evalArraySlicingNode(node: ArraySlicingNode): any {
    const list = evalutateExpression(node.expr) as any[];
    const start = evalutateExpression(node.start) as number - 1;
    let end = evalutateExpression(node.end) as number;
    if (end === -1) {
        end = list.length;
    } else {
        end--;
    }
    if (node.excludeUpperBound) {
        end--;
    }
    return list.slice(start, end + 1);

}

function evalArrayAccess(node: ArrayAccessNode): any {
    const items = evalutateExpression(node.expr) as any[];
    const index = evalutateExpression(node.index);
    if (index === -1) {
        return items[items.length - 1];
    }
    return items[index - 1];
}

function evalIfStatement(stmt: IfStatement | ElifStatement | ElseStatement): void {
    if (stmt.kind === "Else") {
        evalutateExpression(stmt.body);
        return;
    }
    if (evalutateExpression(stmt.condition)) {
        evalutateExpression(stmt.body);
    } else if (stmt.else !== null) {
        evalutateExpression(stmt.else);
    }
}

function evalForStatement(stmt: ForStatement): void {
    const items = evalutateExpression(stmt.items) as any[];
    for (let i = 0; i < items.length; i++) {
        const assignmentNode: AssignmentNode = {
            dataType: "",
            expression: {
                kind: "ArrayAccess",
                expr: stmt.items,
                index: {
                    kind: "Number",
                    value: i + 1
                }
            },
            kind: "Assignment",
            variableNode: stmt.iterator
        };
        evalAssignmentNode(assignmentNode);

    }

}
