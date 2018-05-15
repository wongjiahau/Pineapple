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

export type Statement
    = AssignmentNode
    | ExpressionNode
    | IfStatement
    | ElifStatement
    | ElseStatement
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
            return evalIfStatement(statement);
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
    }
}

function evalUnaryOperatorNode(node: UnaryOperatorNode): number {
    const value = evalutateExpression(node.inner) as number;
    return node.operator === "-" ? -value : value;
}

function evalBinaryOperatorNode(node: BinaryOperatorNode): number | boolean {
    const leftValue = evalutateExpression(node.left) as number;
    const rightValue = evalutateExpression(node.right) as number;
    switch (node.operator) {
        case "+": return  leftValue + rightValue;
        case "-": return leftValue - rightValue;
        case "*": return leftValue * rightValue;
        case "/": return leftValue / rightValue;
        case "%": return leftValue % rightValue;
        case "^": return Math.pow(leftValue, rightValue);
        case ">": return leftValue > rightValue;
        case "<": return leftValue < rightValue;
        case "<=": return leftValue <= rightValue;
        case ">=": return leftValue >= rightValue;
        case "==": return leftValue === rightValue;
        case "!=": return leftValue !== rightValue;
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
    const start = evalutateExpression(node.start) as number;
    let end = evalutateExpression(node.end) as number;
    if (end === -1) {
        end = list.length;
    }
    if (node.excludeUpperBound) {
        end--;
    }
    return list.slice(start, end + 1);

}

function evalIfStatement(stmt: IfStatement): void {
    if (evalutateExpression(stmt.condition)) {
        evalutateExpression(stmt.body);
    } else if (stmt.else !== null) {
        evalutateExpression(stmt.else);
    }
}
