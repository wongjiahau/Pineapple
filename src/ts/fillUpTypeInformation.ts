import { Declaration, Expression, Statement, TokenLocation, TypeExpression, Variable } from "./ast";

export function fillUpTypeInformation(ast: Declaration): Declaration {
    ast.body.statements = fillUp(ast.body.statements);
    if (ast.next !== null) {
        ast.next = fillUpTypeInformation(ast.next);
    }
    return ast;
}

export interface VariableTable {
    [key: string]: Variable;
}

const VARIABLE_TABLE: VariableTable = {};

function updateVariableTable(v: VariableTable, variable: Variable) {
    if (v[variable.name.value]) {
        throw errorMessage(`Variable \`${variable.name.value}\` is already assigned`
                , variable.name.location);
    }
    v[variable.name.value] = variable;
}

function errorMessage(message: string, location: TokenLocation): string {
    return `${message} (at line ${location.first_line} column ${location.first_column})`;
}

export function fillUp(s: Statement): Statement {
    switch (s.body.kind) {
        case "LinkStatement":
            s.body.variable.returnType = getType(s.body.expression);
            updateVariableTable(VARIABLE_TABLE, s.body.variable);
            break;
        case "FunctionCall":
            break;
    }
    if (s.next !== null) {
        s.next = fillUp(s.next);
    }
    return s;
}

export function getType(e: Expression): TypeExpression {
    let typename: string;
    switch (e.kind) {
        case "String":
            typename = "string";
            break;
        case "Number":
            typename = e.value.indexOf(".") > -1 ? "Double" : "Int";
            break;
        case "Variable":
            return VARIABLE_TABLE[e.name.value].returnType;
        case "FunctionCall":
            for (let i = 0; i < e.parameters.length; i++) {
                e.parameters[i].returnType = getType(e.parameters[i]);
            }
            return e.returnType;
    }
    return {
        and: null,
        or: null,
        isList: false,
        kind: "TypeExpression",
        listSize: null,
        name: typename
    };
}
