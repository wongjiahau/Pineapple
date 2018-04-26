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
    | NumberNode
    | VariableNode
    | ArrayNode
    | ObjectNode
    ;

export function evalutateExpression(expression: ExpressionNode): number | object {
    switch (expression.kind) {
        case "Number":
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
    const result: {[index: string]: any} = {};
    result[node.name] = evalutateExpression(node.expression);
    let next: ObjectMemberNode = node.next;
    while (next) {
        result[next.name] = evalutateExpression(next.expression);
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
