import {
    ArrayAccess,
    ArrayElement,
    ArrayExpression,
    BooleanExpression,
    BranchStatement,
    Declaration,
    Expression,
    ForStatement,
    FunctionCall,
    FunctionDeclaration,
    NumberExpression,
    Statement,
    StringExpression,
    TestExpression,
    TypeExpression,
    Variable,
    VariableDeclaration,
    AtomicToken
} from "./ast";

import {
    ErrorNoConformingFunction,
    ErrorUsingUnknownFunction,
    ErrorVariableRedeclare,
    PineError,
    RawError
} from "./errorType";

import { stringifyFuncSignature, stringifyType } from "./transpile";
import { newTypeTree, TypeTree, childOf } from "./typeTree";

export function fillUpTypeInformation(
        ast: Declaration,
        prevFuntab: FunctionTable,
        prevTypeTree: TypeTree
    ): Declaration {
    const vtab = getVariableTable(ast.body.parameters);
    const ftab = newFunctionTable(ast.body, prevFuntab);
    const symbols: SymbolTable = {
        vartab: vtab,
        functab: ftab,
        typeTree: prevTypeTree
    };
    ast.body.statements = fillUp(ast.body.statements, symbols);
    if (ast.next !== null) {
        ast.next = fillUpTypeInformation(ast.next, ftab, prevTypeTree);
    }
    return ast;
}

export function newFunctionTable(f: FunctionDeclaration, funtab: FunctionTable): FunctionTable {
    const result: FunctionTable = {};
    const key = stringifyFuncSignature(f.signature);
    if (!result[key]) {
        result[key] = [];
    }
    result[key].push(f);
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

export interface SymbolTable {
    vartab: VariableTable;
    functab: FunctionTable;
    typeTree: TypeTree;
}

export interface VariableTable {
    [key: string]: Variable;
}

export interface FunctionTable {
    [key: string]: FunctionDeclaration[];
}

function updateVariableTable(vtab: VariableTable, variable: Variable): VariableTable {
    const initialDecl = vtab[variable.repr];
    if (initialDecl) {
        const error: ErrorVariableRedeclare = {
            kind: "ErrorVariableRedeclare",
            initialVariable: initialDecl,
            newVariable: variable,
        };
        raise(error);
    }
    vtab[variable.repr] = variable;
    return vtab;
}

function raise(error: RawError) {
    const throwable = new PineError();
    throwable.rawError = error;
    throw throwable;
}

export function fillUp(s: Statement, symbols: SymbolTable): Statement {
    switch (s.body.kind) {
    case "ReturnStatement":
        s.body.expression = fillUpExpressionTypeInfo(s.body.expression, symbols);
        break;
    case "AssignmentStatement":
        switch (s.body.variable.kind) {
        case "VariableDeclaration":
            if (s.body.variable.typeExpected === null) {
                // Inference-typed
                s.body.expression = fillUpExpressionTypeInfo(s.body.expression, symbols);
                s.body.variable.variable.returnType = getType(s.body.expression, symbols.vartab);
            } else {
                // Statically-typed
                s.body.expression.returnType = s.body.variable.typeExpected;
                s.body.variable.variable.returnType = s.body.variable.typeExpected;
            }
            symbols.vartab = updateVariableTable(symbols.vartab, s.body.variable.variable);
            break;
        case "Variable":
            const matching = symbols.vartab[s.body.variable.repr];
            s.body.expression = fillUpExpressionTypeInfo(s.body.expression, symbols);
            if (!typeEquals(matching.returnType, s.body.expression.returnType)) {
                errorMessage(
`The data type of ${matching.repr} should be ${stringifyType(matching.returnType)}, ` +
`but you assigned it with ${stringifyType(s.body.expression.returnType)}`, matching.location);
            } else {
                s.body.variable.returnType = matching.returnType;
            }
            break;
        }
        break;
    case "FunctionCall":
        s.body = fillUpFunctionCallTypeInfo(s.body, symbols);
        break;
    case "BranchStatement":
        s.body = fillUpBranchTypeInfo(s.body, symbols);
        break;
    case "ForStatement":
        s.body = fillUpForStmtTypeInfo(s.body, symbols);
        break;
    case "WhileStatement":
        s.body.test = fillUpTestExprTypeInfo(s.body.test, symbols);
        s.body.body = fillUp(s.body.body, symbols);
        break;
    }
    if (s.next !== null) {
        s.next = fillUp(s.next, symbols);
    }
    return s;
}

export function fillUpForStmtTypeInfo(f: ForStatement, symbols: SymbolTable): ForStatement {
    f.expression = fillUpExpressionTypeInfo(f.expression, symbols);
    if (f.expression.returnType.kind === "ArrayType") {
        f.iterator.returnType = f.expression.returnType.arrayOf;
        symbols.vartab = updateVariableTable(symbols.vartab, f.iterator);
    } else {
        errorMessage("The expresison type in for statement should be array.", null);
    }
    f.body = fillUp(f.body, symbols);
    return f;
}

export function fillUpTestExprTypeInfo(t: TestExpression, symbols: SymbolTable): TestExpression {
    t.current = fillUpFunctionCallTypeInfo(t.current, symbols);
    let next = t.next;
    while (next !== null) {
        next.current = fillUpFunctionCallTypeInfo(next.current, symbols);
        next = next.next;
    }
    return t;
}

export function fillUpBranchTypeInfo(b: BranchStatement, symbols: SymbolTable): BranchStatement {
    b.body = fillUp(b.body, symbols);
    if (b.test !== null) {
        b.test = fillUpTestExprTypeInfo(b.test, symbols);
    }
    if (b.elseBranch !== null) {
        b.elseBranch = fillUpBranchTypeInfo(b.elseBranch, symbols);
    }
    return b;
}

export function fillUpExpressionTypeInfo(e: Expression, symbols: SymbolTable): Expression {
    switch (e.kind) {
        case "FunctionCall":    return fillUpFunctionCallTypeInfo(e, symbols);
        case "Array":           return fillUpArrayTypeInfo       (e, symbols);
        case "Number":          return fillUpSimpleTypeInfo      (e, "Number");
        case "String":          return fillUpSimpleTypeInfo      (e, "String");
        case "Boolean":         return fillUpSimpleTypeInfo      (e, "Boolean");
        case "Variable":        return fillUpVariableTypeInfo    (e, symbols.vartab);
        case "ArrayAccess":
            e.subject = fillUpExpressionTypeInfo(e.subject, symbols);
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

export function fillUpFunctionCallTypeInfo(e: FunctionCall, symbols: SymbolTable): FunctionCall {
    for (let i = 0; i < e.parameters.length; i++) {
        e.parameters[i] = fillUpExpressionTypeInfo(e.parameters[i], symbols);
    }
    e = getFuncSignature(e, symbols.functab, symbols.typeTree);
    return e;
}

export function getFuncSignature(f: FunctionCall, functab: FunctionTable, typetree: TypeTree)
    :FunctionCall {
    const key = stringifyFuncSignature(f.signature);
    if (key in functab) {
        const matchingFunctions = functab[key];
        for (let i = 0; i < matchingFunctions.length; i++) {
            if (paramTypesConforms(
                    matchingFunctions[i].parameters,
                    f.parameters,
                    typetree
                )) {
                for (let j = 0; j < f.parameters.length; j++) {
                    f.parameters[j].returnType =
                        matchingFunctions[i].parameters[j].typeExpected;
                }
                return f;
            } else {
                const error: ErrorNoConformingFunction = {
                    kind: "ErrorNoConformingFunction",
                    func: f,
                    matchingFunctions: matchingFunctions
                };
                raise(error);
            }
        }
    } else {
        const error: ErrorUsingUnknownFunction = {
            kind: "ErrorUsingUnknownFunction",
            func: f
        };
        raise(error);
    }
}

export function paramTypesConforms(
    actualParams: VariableDeclaration[],
    matchingParams: Expression[],
    typeTree: TypeTree
): boolean {
    if (actualParams.length !== matchingParams.length) {
        return false;
    }
    for (let i = 0; i < actualParams.length; i++) {
        const expectedType = actualParams[i].typeExpected;
        const actualType = matchingParams[i].returnType;
        if (!typeEquals(expectedType, actualType)
         && !childOf(actualType, expectedType, typeTree)) {
            return false;
        }
    }
    return true;
}

export function fillUpArrayTypeInfo(e: ArrayExpression, symbols: SymbolTable): ArrayExpression {
    return {
        ...e,
        returnType: getType(e, symbols.vartab)
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

export function typeEquals(x: TypeExpression, y: TypeExpression): boolean {
    return stringifyType(x) === stringifyType(y);
}
