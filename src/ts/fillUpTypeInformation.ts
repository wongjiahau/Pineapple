import {
    Declaration,
    Expression,
    FunctionCall,
    FunctionDeclaration,
    Statement,
    TokenLocation,
    TypeExpression,
    Variable
} from "./ast";

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
        throw errorMessage(`Variable \`${variable.name.value}\` is already assigned`, variable.name.location);
    }
    v[variable.name.value] = variable;
}

function errorMessage(message: string, location: TokenLocation): string {
    return `${message} (at line ${location.first_line} column ${location.first_column})`;
}

export function fillUp(s: Statement): Statement {
    switch (s.body.kind) {
        case "AssignmentStatement":
            if (s.body.expression.kind === "FunctionCall") {
                s.body.expression = fillUpFunctionCallTypeInfo(s.body.expression);
            } else {
                s.body.variable.returnType = getType(s.body.expression);
                updateVariableTable(VARIABLE_TABLE, s.body.variable);
            }
            break;
        case "FunctionCall":
            for (let i = 0; i < s.body.parameters.length; i++) {
                s.body.parameters[i].returnType = getType(s.body.parameters[i]);
            }
            break;
    }
    if (s.next !== null) {
        s.next = fillUp(s.next);
    }
    return s;
}

export function fillUpFunctionCallTypeInfo(e: FunctionCall): FunctionCall {
    for (let i = 0; i < e.parameters.length; i++) {
        e.parameters[i].returnType = getType(e.parameters[i]);
        const expression = e.parameters[i];
        if (expression.kind === "FunctionCall") {
            e.parameters[i] = fillUpFunctionCallTypeInfo(expression);
        }
    }
    return e;
}

export function getType(e: Expression): TypeExpression {
    let typename = "";
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
            return e.returnType;
    }
    return {
        kind: "SimpleType",
        name: {
            location: null,
            value: typename
        },
        nullable: false
    };
}
