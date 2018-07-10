import {
    ArrayAccess,
    ArrayExpression,
    BooleanExpression,
    BranchStatement,
    Declaration,
    Expression,
    FunctionCall,
    NumberExpression,
    Statement,
    StringExpression,
    TokenLocation,
    TypeExpression,
    Variable,
    VariableDeclaration
} from "./ast";

export function fillUpTypeInformation(ast: Declaration): Declaration {
    if (ast.body.kind === "FunctionDeclaration") {
        const variableTable = getFunctionVariables(ast.body.parameters);
        ast.body.statements = fillUp(ast.body.statements, variableTable);
    } else {
        ast.body.statements = fillUp(ast.body.statements, {});
    }
    if (ast.next !== null) {
        ast.next = fillUpTypeInformation(ast.next);
    }
    return ast;
}

export function getFunctionVariables(variables: VariableDeclaration[]): VariableTable {
    const result: VariableTable = {};
    for (let i = 0; i < variables.length; i++) {
        variables[i].variable.returnType = variables[i].typeExpected;
        result[variables[i].variable.repr] = variables[i].variable;
    }
    return result;
}

export interface VariableTable {
    [key: string]: Variable;
}

function updateVariableTable(v: VariableTable, variable: Variable): VariableTable {
    if (v[variable.repr]) {
        throw errorMessage(`Variable \`${variable.repr}\` is already assigned`, variable.location);
    }
    v[variable.repr] = variable;
    return v;
}

function errorMessage(message: string, location: TokenLocation | null): string {
    if (location) {
        return `${message} (at line ${location.first_line} column ${location.first_column})`;
    } else {
        return `${message}`;
    }
}

export function fillUp(s: Statement, variableTable: VariableTable): Statement {
    switch (s.body.kind) {
        case "ReturnStatement":
            s.body.expression = fillUpExpressionTypeInfo(s.body.expression, variableTable);
            break;
        case "AssignmentStatement":
            s.body.expression = fillUpExpressionTypeInfo(s.body.expression, variableTable);
            if (s.body.variable.kind === "VariableDeclaration") {
                s.body.variable.variable.returnType = getType(s.body.expression, variableTable);
                variableTable = updateVariableTable(variableTable, s.body.variable.variable);
            }
            break;
        case "FunctionCall":
            for (let i = 0; i < s.body.parameters.length; i++) {
                s.body.parameters[i] = fillUpExpressionTypeInfo(s.body.parameters[i], variableTable);
            }
            break;
        case "BranchStatement":
            s.body = fillUpBranchTypeInfo(s.body, variableTable);
            break;
        case "ForStatement":
            s.body.expression = fillUpExpressionTypeInfo(s.body.expression, variableTable);
            break;
    }
    if (s.next !== null) {
        s.next = fillUp(s.next, variableTable);
    }
    return s;
}

export function fillUpBranchTypeInfo(b: BranchStatement, variableTable: VariableTable): BranchStatement {
    if (b.test !== null) {
        b.test.current = fillUpFunctionCallTypeInfo(b.test.current, variableTable);
    }
    if (b.elseBranch !== null) {
        b.elseBranch = fillUpBranchTypeInfo(b.elseBranch, variableTable);
    }
    return b;
}

export function fillUpExpressionTypeInfo(e: Expression, variableTable: VariableTable): Expression {
    switch (e.kind) {
        case "FunctionCall":    return fillUpFunctionCallTypeInfo(e, variableTable);
        case "Array":           return fillUpArrayTypeInfo       (e, variableTable);
        case "Number":          return fillUpSimpleTypeInfo      (e, "Number");
        case "String":          return fillUpSimpleTypeInfo      (e, "String");
        case "Boolean":         return fillUpSimpleTypeInfo      (e, "Boolean");
        case "Variable":        return fillUpVariableTypeInfo    (e, variableTable);
        case "ArrayAccess":
            e.subject = fillUpExpressionTypeInfo(e.subject, variableTable);
            return fillUpArrayAccessTypeInfo(e);
        default: return e;
    }
}

export function fillUpArrayAccessTypeInfo(a: ArrayAccess): ArrayAccess {
    switch (a.subject.returnType.kind) {
        case "SimpleType":
            throw errorMessage(`Variable \`${a.subject}\` is not array type.`, a.subject.location);
        case "ArrayType":
            return {
                ...a,
                returnType: a.subject.returnType.arrayOf
            };
    }
}

export function fillUpVariableTypeInfo(e: Variable, variableTable: VariableTable): Variable {
    e.returnType = variableTable[e.repr].returnType;
    return e;
}

export type SimpleExpression
    = NumberExpression
    | StringExpression
    | BooleanExpression
    ;

export function fillUpSimpleTypeInfo(e: SimpleExpression, name: string): SimpleExpression {
    return {
        ...e,
        returnType: {
            kind: "SimpleType",
            name: {
                repr: name,
                location: null,
            },
            nullable: false
        }
    };
}

export function fillUpFunctionCallTypeInfo(e: FunctionCall, variableTable: VariableTable): FunctionCall {
    for (let i = 0; i < e.parameters.length; i++) {
        e.parameters[i] = fillUpExpressionTypeInfo(e.parameters[i], variableTable);
    }
    return e;
}

export function fillUpArrayTypeInfo(e: ArrayExpression, variableTable: VariableTable): ArrayExpression {
    return {
        ...e,
        returnType: {
            kind: "ArrayType",
            arrayOf: getType(e.elements.value, variableTable),
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
            typename = "Number";
            break;
        case "Variable":
            return variableTable[e.repr].returnType;
        case "FunctionCall":
            return e.returnType;
    }
    return {
        kind: "SimpleType",
        name: {
            location: null,
            repr: typename
        },
        nullable: false
    };
}
