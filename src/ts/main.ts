interface BinaryOperatorNode {
    kind: "BinaryOperator";
    left: ExpressionNode;
    right: ExpressionNode;
    operator: "+" | "*" | "-" | "/";
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

type ExpressionNode
    = BinaryOperatorNode
    | UnaryOperatorNode
    | NumberNode;

function evaluate(expression: ExpressionNode): number {
    switch (expression.kind) {
        case "Number":
            return expression.value;
        case "UnaryOperator":
            return evalUnaryOperator(expression);
        case "BinaryOperator":
            return evalBinaryOperator(expression);
    }
}

function evalUnaryOperator(node: UnaryOperatorNode): number {
    const value = evaluate(node.inner);
    return node.operator === "-" ? -value : value;
}

function evalBinaryOperator(node: BinaryOperatorNode): number {
    const leftValue = evaluate(node.left);
    const rightValue = evaluate(node.right);
    switch (node.operator) {
        case "+": return  leftValue + rightValue;
        case "-": return leftValue - rightValue;
        case "*": return leftValue * rightValue;
        case "/": return leftValue / rightValue;
    }
}

const expr1: ExpressionNode = {
    kind: "BinaryOperator",
    operator: "*",
    left: {
        kind: "BinaryOperator",
        operator: "+",
        left: {
            kind: "Number",
            value: 42
        },
        right: {
            kind: "Number",
            value: 5
        }
    },
    right: {
        kind: "UnaryOperator",
        operator: "-",
        inner: {
            kind: "Number",
            value: 12
        }
    }
};
