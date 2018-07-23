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
    LinkedNode,
    NumberExpression,
    Statement,
    StringExpression,
    TestExpression,
    TypeExpression,
    Variable,
    VariableDeclaration
} from "./ast";

import {
    ErrorNoConformingFunction,
    ErrorUsingUnknownFunction,
    ErrorVariableRedeclare,
    PineError,
    RawError
} from "./errorType";

import { stringifyFuncSignature, stringifyType } from "./transpile";
import { childOf, newTypeTree, TypeTree } from "./typeTree";

export function fillUpTypeInformation(
        decls: Declaration[],
        prevFuntab: FunctionTable,
        prevTypeTree: TypeTree
    ): [Declaration[], FunctionTable, TypeTree] {
    // Complete the function table
    // This step is to allow programmer to define function anywhere
    // without needing to adhere to strict top-down or bottom-up structure
    let funcTab = prevFuntab;
    for (let i = 0; i < decls.length; i++) {
        const currentDecl = decls[i];
        switch (currentDecl.kind) {
            case "FunctionDeclaration":
                funcTab = newFunctionTable(currentDecl, funcTab);
        }
    }

    for (let i = 0; i < decls.length; i++) {
        const currentDecl = decls[i];
        switch (currentDecl.kind) {
            case "FunctionDeclaration":
                const vtab = getVariableTable(currentDecl.parameters);
                const symbols: SymbolTable = {
                    vartab: vtab,
                    functab: funcTab,
                    typeTree: prevTypeTree
                };
                currentDecl.statements = fillUp(currentDecl.statements, symbols);
        }
    }
    return [decls, funcTab, prevTypeTree];
}

export function newFunctionTable(newFunc: FunctionDeclaration, previousFuncTab: FunctionTable): FunctionTable {
    const key = stringifyFuncSignature(newFunc.signature);
    if (!previousFuncTab[key]) {
        previousFuncTab[key] = [];
    }
    previousFuncTab[key].push(newFunc);
    return previousFuncTab;
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

export function fillUp(s: LinkedNode<Statement>, symbols: SymbolTable): LinkedNode<Statement> {
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
    if (f.expression.returnType.kind === "CompoundType") {
        f.iterator.returnType = f.expression.returnType.of;
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
        case "CompoundType":
            return {
                ...a,
                returnType: a.subject.returnType.of
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
    : FunctionCall {
    const key = stringifyFuncSignature(f.signature);
    if (key in functab) {
        const matchingFunctions = functab[key];
        const closestFunction = getClosestFunction(f, matchingFunctions, typetree);
        if (closestFunction !== null) {
            for (let j = 0; j < f.parameters.length; j++) {
                f.parameters[j].returnType =
                   closestFunction.parameters[j].typeExpected;
            }
            f.returnType = closestFunction.returnType;
            return f;
        } else {
            const error: ErrorNoConformingFunction = {
                kind: "ErrorNoConformingFunction",
                func: f,
                matchingFunctions: matchingFunctions
            };
            raise(error);
        }

    } else {
        const error: ErrorUsingUnknownFunction = {
            kind: "ErrorUsingUnknownFunction",
            func: f
        };
        raise(error);
    }
}

export function getClosestFunction(
    f: FunctionCall,
    matchingFunctions: FunctionDeclaration[],
    typeTree: TypeTree
): FunctionDeclaration | null {
    const first = matchingFunctions[0];
    let closestFunction = first;
    let minimumDistance = paramTypesConforms(first.parameters, f.parameters, typeTree);
    for (let i = 1; i < matchingFunctions.length; i++) {
        const distance = paramTypesConforms(
                matchingFunctions[i].parameters,
                f.parameters,
                typeTree
        );
        if (distance < minimumDistance) {
            closestFunction = matchingFunctions[i];
            minimumDistance = distance;
            return matchingFunctions[i];
        }
    }
    // 99 means no matching parent
    if (minimumDistance >= 99) {
        return null;
    } else {
        return closestFunction;
    }
}

export function paramTypesConforms(
    actualParams: VariableDeclaration[],
    matchingParams: Expression[],
    typeTree: TypeTree
): number {
    if (actualParams.length !== matchingParams.length) {
        return 99;
    }
    let score = 0;
    for (let i = 0; i < actualParams.length; i++) {
        const expectedType = actualParams[i].typeExpected;
        const actualType = matchingParams[i].returnType;
        if (typeEquals(expectedType, actualType)) {
            score += 0;
        } else {
            score += childOf(actualType, expectedType, typeTree);
        }
    }
    return score;
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
                kind: "CompoundType",
                name: "Array",
                of: getElementsType(e.elements, vtab),
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
