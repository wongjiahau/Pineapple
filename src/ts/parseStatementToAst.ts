import { IStatement } from "./groupStatements";
import { ExpressionNode, ObjectMemberNode, ObjectNode } from "./interpreter";
const parse = require("../jison/pineapple-parser.js").parse;

// AST stands for abstract syntax tree
export function parseStatementToAst(statement: IStatement): ExpressionNode {
    const ast = parse(statement.content) as ExpressionNode;
    if (statement.children.length === 0) {
        return ast;
    }
    if (ast.kind === "Assignment") {
        if (ast.expression !== null) {
                throw new Error("Assignment is not partial, but it has child statement.");
        }
        const objectNode: ObjectNode = {
            kind: "Object",
            memberNode:  parseManyStatementsToAst(statement.children) as ObjectMemberNode
        };
        ast.expression = objectNode;
    }
    return ast;
}

export function parseManyStatementsToAst(statements: IStatement[]): ExpressionNode {
    const firstStmt = statements[0];
    const firstNode = parse(firstStmt.content);
    let previousNode = firstNode;
    if (firstStmt.children.length > 0) {
        previousNode.expression = parseManyStatementsToAst(firstStmt.children);
    }
    for (let i = 1; i < statements.length; i++) {
        const stmt = statements[i];
        const currentNode = parse(stmt.content) as ExpressionNode;
        if ("next" in previousNode)  {
            previousNode.next = currentNode;
            previousNode = currentNode;
            if (stmt.children.length > 0) {
                if (previousNode.kind === "ObjectMember") {
                    previousNode.expression = {
                        kind: "Object",
                        memberNode: parseManyStatementsToAst(stmt.children)
                    };
                } else {
                    previousNode.expression = parseManyStatementsToAst(stmt.children);
                }
            }
        } else {
            throw new Error("Statements are of the same indent level, but some statements don't have `next` property.");
        }
    }
    return firstNode;
}
