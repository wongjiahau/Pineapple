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

type ExpressionNode
    = AssignmentNode
    | BinaryOperatorNode
    | UnaryOperatorNode
    | NumberNode
    | VariableNode
    ;

export function evalutateExpression(expression: ExpressionNode): number {
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
    }
}

function evalUnaryOperatorNode(node: UnaryOperatorNode): number {
    const value = evalutateExpression(node.inner);
    return node.operator === "-" ? -value : value;
}

function evalBinaryOperatorNode(node: BinaryOperatorNode): number {
    const leftValue = evalutateExpression(node.left);
    const rightValue = evalutateExpression(node.right);
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
function evalAssignmentNode(node: AssignmentNode): number {
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
