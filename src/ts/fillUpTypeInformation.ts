import { Declaration, Expression, Statement, TypeExpression } from "./ast";

export function fillUpTypeInformation(ast: Declaration): Declaration {
    ast.body.statements = fillUp(ast.body.statements);
    if (ast.next !== null) {
        ast.next = fillUpTypeInformation(ast.next);
    }
    return ast;
}

export interface VariableTable {
    [key: string]: {type: TypeExpression};
}

const vTable: VariableTable = {};

export function fillUp(s: Statement): Statement {
    switch (s.body.kind) {
        case "LinkStatement":
            s.body.variable.returnType = getType(s.body.expression, vTable);
            vTable[s.body.variable.name] = {
                type: s.body.variable.returnType
            };
            break;
        case "FunctionCall":
            break;
    }
    if (s.next !== null) {
        s.next = fillUp(s.next);
    }
    return s;
}

export function getType(e: Expression, vTable: VariableTable): TypeExpression {
    let typename: string;
    switch (e.kind) {
        case "String":
            typename = "string";
            break;
        case "Number":
            typename = e.value.indexOf(".") > -1 ? "Double" : "Int";
            break;
        case "Variable":
            return vTable[e.name].type;
        case "FunctionCall":
            for (let i = 0; i < e.parameters.length; i++) {
                e.parameters[i].returnType = getType(e.parameters[i], vTable);
            }
            return e.returnType;
    }
    return {
        and: null,
        or: null,
        isList: false,
        kind: "TypeExpression",
        listSize: null,
        name: typename;
    };
}
