import {
    Declaration,
    Expression,
    FunctionCall,
    ListExpression,
    Statement,
    TokenLocation,
    TypeExpression,
    Variable
} from "./ast";

export function fillUpTypeInformation(ast: Declaration): Declaration {
    ast.body.statements = fillUp(ast.body.statements, {});
    if (ast.next !== null) {
        ast.next = fillUpTypeInformation(ast.next);
    }
    return ast;
}

export interface VariableTable {
    [key: string]: Variable;
}

function updateVariableTable(v: VariableTable, variable: Variable): VariableTable {
    if (v[variable.name.value]) {
        throw errorMessage(`Variable \`${variable.name.value}\` is already assigned`, variable.name.location);
    }
    v[variable.name.value] = variable;
    return v;
}

function errorMessage(message: string, location: TokenLocation): string {
    return `${message} (at line ${location.first_line} column ${location.first_column})`;
}

export function fillUp(s: Statement, variableTable: VariableTable): Statement {
    switch (s.body.kind) {
        case "AssignmentStatement":
            s.body.expression = fillUpExpressionTypeInfo(s.body.expression, variableTable);
            s.body.variable.returnType = getType(s.body.expression, variableTable);
            updateVariableTable(variableTable, s.body.variable);
            break;
        case "FunctionCall":
            for (let i = 0; i < s.body.parameters.length; i++) {
                s.body.parameters[i].returnType = getType(s.body.parameters[i], variableTable);
            }
            break;
    }
    if (s.next !== null) {
        s.next = fillUp(s.next, variableTable);
    }
    return s;
}

export function fillUpExpressionTypeInfo(e: Expression, variableTable: VariableTable): Expression {
    switch (e.kind) {
        case "FunctionCall": return fillUpFunctionCallTypeInfo(e, variableTable);
        case "List": return fillUpListTypeInfo(e, variableTable);
        default: return e;
    }
}

export function fillUpFunctionCallTypeInfo(e: FunctionCall, variableTable: VariableTable): FunctionCall {
    for (let i = 0; i < e.parameters.length; i++) {
        e.parameters[i].returnType = getType(e.parameters[i], variableTable);
        const expression = e.parameters[i];
        if (expression.kind === "FunctionCall") {
            e.parameters[i] = fillUpFunctionCallTypeInfo(expression, variableTable);
        }
    }
    return e;
}

export function fillUpListTypeInfo(e: ListExpression, variableTable: VariableTable): ListExpression {
    return {
        ...e,
        returnType: {
            kind: "ListType",
            listOf: getType(e.elements.value, variableTable),
            nullable: false,
        }
    };
}

export function getType(e: Expression, variableTable: VariableTable): TypeExpression {
    let typename = "";
    switch (e.kind) {
        case "String":
            typename = "String";
            break;
        case "Number":
            typename = e.value.indexOf(".") > -1 ? "Float" : "Int";
            break;
        case "Variable":
            return variableTable[e.name.value].returnType;
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
