interface BinaryOperatorNode {
    kind: "BinaryOperator";
    left: ExpressionNode;
    right: ExpressionNode;
    operator: "+" | "*" | "-" | "/" | "%" | "^";
}

interface UnaryOperatorNode {
    kind: "UnaryOperator";
    operator: "+" | "-";
    inner: ExpressionNode;
}

interface NumberNode {
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

interface AssignmentNode {
    kind: "Assignment";
    variableNode: VariableNode;
    dataType: string;
    expression: ExpressionNode;
}

interface VariableNode {
    kind: "VariableName";
    name: string;
}

interface ObjectNode {
    kind: "Object";
    memberNode: ObjectMemberNode;
}

interface ObjectMemberNode {
    kind: "ObjectMember";
    name: string;
    expression: ExpressionNode;
    next: ObjectMemberNode;
}

interface ArrayNode {
    kind: "ArrayNode";
    element: ElementNode;
}

interface ElementNode {
    kind: "Element";
    expression: ExpressionNode;
    next: ElementNode;
}

type ExpressionNode
    = AssignmentNode
    | BinaryOperatorNode
    | UnaryOperatorNode
    | VariableNode
    | ArrayNode
    | ObjectNode
    | ValueNode
    ;

type ValueNode
    = NumberNode
    | StringNode
    | BooleanNode
    | NullNode
    ;

export function evalutateExpression(expression: ExpressionNode): any {
    switch (expression.kind) {
        case "Number":
        case "Boolean":
        case "Null":
        case "String":
            return expression.value;
        case "UnaryOperator":
            return evalUnaryOperatorNode(expression);
        case "BinaryOperator":
            return evalBinaryOperatorNode(expression);
        case "Assignment":
            return evalAssignmentNode(expression);
        case "VariableName":
            return evalVariableNode(expression);
        case "ArrayNode":
            return evalElementNode(expression.element);
        case "Object":
            return evalObjectMemberNode(expression.memberNode);
    }
}

function evalUnaryOperatorNode(node: UnaryOperatorNode): number {
    const value = evalutateExpression(node.inner) as number;
    return node.operator === "-" ? -value : value;
}

function evalBinaryOperatorNode(node: BinaryOperatorNode): number {
    const leftValue = evalutateExpression(node.left) as number;
    const rightValue = evalutateExpression(node.right) as number;
    switch (node.operator) {
        case "+": return  leftValue + rightValue;
        case "-": return leftValue - rightValue;
        case "*": return leftValue * rightValue;
        case "/": return leftValue / rightValue;
        case "%": return leftValue % rightValue;
        case "^": return Math.pow(leftValue, rightValue);
    }
}

const VARIABLES_TABLE: {[index: string]: {dataType: string, value: any}} = {};
function evalAssignmentNode(node: AssignmentNode): any {
    const exprValue = evalutateExpression(node.expression);
    VARIABLES_TABLE[node.variableNode.name] = {
        dataType: node.dataType,
        value: exprValue
    };
    return exprValue;
}

function evalVariableNode(node: VariableNode): number {
    return VARIABLES_TABLE[node.name].value;
}

function evalObjectMemberNode(node: ObjectMemberNode): object {
    if (node === null) {
        return {};
    }
    const result: {[index: string]: any} = {};
    // We slice one in order to get rid of the dot prefix
    result[node.name.slice(1)] = evalutateExpression(node.expression);
    let next: ObjectMemberNode = node.next;
    while (next) {
        result[next.name.slice(1)] = evalutateExpression(next.expression);
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
