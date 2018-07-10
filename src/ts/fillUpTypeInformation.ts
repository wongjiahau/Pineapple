import {
    ArrayAccess,
    ArrayElement,
    ArrayExpression,
    BooleanExpression,
    BranchStatement,
    Declaration,
    Expression,
    FunctionCall,
    FunctionDeclaration,
    NumberExpression,
    Statement,
    StringExpression,
    TestExpression,
    TokenLocation,
    TypeExpression,
    Variable,
    VariableDeclaration
} from "./ast";
import { stringifyFuncSignature } from "./transpile";

export function fillUpTypeInformation(ast: Declaration, prevFuntab: FunctionTable): Declaration {
    const vtab = getVariableTable(ast.body.parameters);
    const ftab = newFunctionTable(ast.body, prevFuntab);
    ast.body.statements = fillUp(ast.body.statements, vtab, ftab);
    if (ast.next !== null) {
        ast.next = fillUpTypeInformation(ast.next, ftab);
    }
    return ast;
}

export function newFunctionTable(f: FunctionDeclaration, funtab: FunctionTable): FunctionTable {
    const result: FunctionTable = {};
    result[stringifyFuncSignature(f.signature)] = f;
    return {...result, ...funtab};
}

export function getVariableTable(variables: VariableDeclaration[]): VariableTable {
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

export interface FunctionTable {
    [key: string]: FunctionDeclaration;
}

function updateVariableTable(v: VariableTable, variable: Variable): VariableTable {
    if (v[variable.repr]) {
        errorMessage(`Variable \`${variable.repr}\` is already assigned`, variable.location);
    }
    v[variable.repr] = variable;
    return v;
}

function errorMessage(message: string, location: TokenLocation | null) {
    let error: string = "";
    if (location) {
        error = `${message} (at line ${location.first_line} column ${location.first_column})`;
    } else {
        error = `${message}`;
    }
    console.error(error);
}

export function fillUp(s: Statement, vtab: VariableTable, ftab: FunctionTable): Statement {
    switch (s.body.kind) {
        case "ReturnStatement":
            s.body.expression = fillUpExpressionTypeInfo(s.body.expression, vtab, ftab);
            break;
        case "AssignmentStatement":
            s.body.expression = fillUpExpressionTypeInfo(s.body.expression, vtab, ftab);
            if (s.body.variable.kind === "VariableDeclaration") {
                s.body.variable.variable.returnType = getType(s.body.expression, vtab);
                vtab = updateVariableTable(vtab, s.body.variable.variable);
            }
            break;
        case "FunctionCall":
            for (let i = 0; i < s.body.parameters.length; i++) {
                s.body.parameters[i] = fillUpExpressionTypeInfo(s.body.parameters[i], vtab, ftab);
            }
            break;
        case "BranchStatement":
            s.body = fillUpBranchTypeInfo(s.body, vtab, ftab);
            break;
        case "ForStatement":
            s.body.expression = fillUpExpressionTypeInfo(s.body.expression, vtab, ftab);
            s.body.body = fillUp(s.body.body, vtab, ftab);
            break;
        case "WhileStatement":
            s.body.test = fillUpTestExprTypeInfo(s.body.test, vtab, ftab);
            s.body.body = fillUp(s.body.body, vtab, ftab);
            break;
    }
    if (s.next !== null) {
        s.next = fillUp(s.next, vtab, ftab);
    }
    return s;
}

export function fillUpTestExprTypeInfo(t: TestExpression, vtab: VariableTable, ftab: FunctionTable): TestExpression {
    t.current = fillUpFunctionCallTypeInfo(t.current, vtab, ftab);
    let next = t.next;
    while (next !== null) {
        next.current = fillUpFunctionCallTypeInfo(next.current, vtab, ftab);
        next = next.next;
    }
    return t;
}

export function fillUpBranchTypeInfo(b: BranchStatement, vtab: VariableTable, ftab: FunctionTable): BranchStatement {
    b.body = fillUp(b.body, vtab, ftab);
    if (b.test !== null) {
        b.test = fillUpTestExprTypeInfo(b.test, vtab, ftab);
    }
    if (b.elseBranch !== null) {
        b.elseBranch = fillUpBranchTypeInfo(b.elseBranch, vtab, ftab);
    }
    return b;
}

export function fillUpExpressionTypeInfo(e: Expression, vtab: VariableTable, ftab: FunctionTable): Expression {
    switch (e.kind) {
        case "FunctionCall":    return fillUpFunctionCallTypeInfo(e, vtab, ftab);
        case "Array":           return fillUpArrayTypeInfo       (e, vtab);
        case "Number":          return fillUpSimpleTypeInfo      (e, "Number");
        case "String":          return fillUpSimpleTypeInfo      (e, "String");
        case "Boolean":         return fillUpSimpleTypeInfo      (e, "Boolean");
        case "Variable":        return fillUpVariableTypeInfo    (e, vtab);
        case "ArrayAccess":
            e.subject = fillUpExpressionTypeInfo(e.subject, vtab, ftab);
            return fillUpArrayAccessTypeInfo(e);
        default: return e;
    }
}

export function fillUpArrayAccessTypeInfo(a: ArrayAccess): ArrayAccess {
    switch (a.subject.returnType.kind) {
        case "SimpleType":
            errorMessage(`Variable \`${a.subject}\` is not array type.`, a.subject.location);
            break;
        case "ArrayType":
            return {
                ...a,
                returnType: a.subject.returnType.arrayOf
            };
    }
}

export function fillUpVariableTypeInfo(e: Variable, vtab: VariableTable): Variable {
    e.returnType = vtab[e.repr].returnType;
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

export function fillUpFunctionCallTypeInfo(e: FunctionCall, vtab: VariableTable, ftab: FunctionTable): FunctionCall {
    for (let i = 0; i < e.parameters.length; i++) {
        e.parameters[i] = fillUpExpressionTypeInfo(e.parameters[i], vtab, ftab);
    }
    e.returnType = getFuncSignature(e, ftab);
    return e;
}

export function getFuncSignature(e: FunctionCall, ftab: FunctionTable): TypeExpression {
    const key = stringifyFuncSignature(e.signature);
    if (key in ftab) {
        return ftab[key].returnType;
    } else {
        console.error(`The function "${key}" does not exist`);
    }
}

export function fillUpArrayTypeInfo(e: ArrayExpression, vtab: VariableTable): ArrayExpression {
    return {
        ...e,
        returnType: getType(e, vtab)
    };
}

export function getType(e: Expression, vtab: VariableTable): TypeExpression {
    let typename = "";
    switch (e.kind) {
        case "String":
            typename = "String";
            break;
        case "Number":
            typename = "Number";
            break;
        case "Variable":
            return vtab[e.repr].returnType;
        case "FunctionCall":
            return e.returnType;
        case "Array":
            return {
                kind: "ArrayType",
                arrayOf: getElementsType(e.elements, vtab),
                nullable: false,
            };
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

export function getElementsType(a: ArrayElement, vtab: VariableTable): TypeExpression {
    const result: TypeExpression[] = [];
    let current: ArrayElement | null = a;
    while (current !== null) {
        result.push(getType(current.value, vtab));
        current = current.next;
    }
    checkIfAllElementTypeAreHomogeneous(result);
    return result[0];
}

export function checkIfAllElementTypeAreHomogeneous(ts: TypeExpression[]): void {
    if (ts.some((x) => x.kind !== ts[0].kind)) {
        throw new Error("Every element in an array should have the same type");
    }
    // TODO: Check if every element is of the same type
}
