import {
    BooleanExpression,
    BranchStatement,
    CompoundType,
    Declaration,
    Expression,
    ForStatement,
    FunctionCall,
    FunctionDeclaration,
    KeyValue,
    LinkedNode,
    ListAccess,
    ListExpression,
    MemberDefinition,
    NumberExpression,
    Statement,
    StringExpression,
    StructDeclaration,
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

import { flattenLinkedNode } from "./getIntermediateForm";
import { prettyPrint } from "./pine2js";
import { stringifyFuncSignature, stringifyType } from "./transpile";
import { childOf, insertChild, newSimpleType, TypeTree } from "./typeTree";
import { find } from "./util";

export function fillUpTypeInformation(
        decls: Declaration[],
        prevFuntab: FunctionTable,
        prevTypeTree: TypeTree,
        prevStructTab: StructTable
    ): [Declaration[], FunctionTable, TypeTree, StructTable] {
    // Complete the function table
    // This step is to allow programmer to define function anywhere
    // without needing to adhere to strict top-down or bottom-up structure
    let funcTab = prevFuntab;
    for (let i = 0; i < decls.length; i++) {
        const currentDecl = decls[i];
        switch (currentDecl.kind) {
            case "FunctionDeclaration":
                funcTab = newFunctionTable(currentDecl, funcTab);
                break;
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
                    typeTree: prevTypeTree,
                    structTab: prevStructTab,
                };
                const [statements, newSymbols] = fillUp(currentDecl.statements, symbols);
                currentDecl.statements = statements;
                funcTab = newSymbols.functab;
                break;
            case "StructDeclaration":
                prevTypeTree = insertChild(currentDecl, newSimpleType("Object"), prevTypeTree);
                prevStructTab = newStructTab(currentDecl, prevStructTab);
                break;
        }
    }
    return [decls, funcTab, prevTypeTree, prevStructTab];
}

export function newStructTab(s: StructDeclaration, structTab: StructTable): StructTable {
    if (s.name.repr in structTab) {
        throw new Error(`${s.name.repr} is already defined.`);
    } else {
        structTab[s.name.repr] = s;
    }
    return structTab;
}

export function newFunctionTable(newFunc: FunctionDeclaration, previousFuncTab: FunctionTable): FunctionTable {
    const key = stringifyFuncSignature(newFunc.signature);
    if (!previousFuncTab[key]) {
        previousFuncTab[key] = [];
    }
    if (previousFuncTab[key].some((x) => functionEqual(x, newFunc))) {
        // dont append the new function into the function table
    } else {
        previousFuncTab[key].push(newFunc);
    }
    return previousFuncTab;
}

export function functionEqual(x: FunctionDeclaration, y: FunctionDeclaration): boolean {
    if (stringifyFuncSignature(x.signature) !== stringifyFuncSignature(y.signature)) {
        return false;
    } else if (x.parameters.length !== y.parameters.length) {
        return false;
    } else {
        for (let i = 0; i < x.parameters.length; i++) {
            if (!typeEquals(x.parameters[i].typeExpected, y.parameters[i].typeExpected)) {
                return false;
            }
        }
    }
    return true;
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
    structTab: StructTable;
    typeTree: TypeTree;
}

export interface StructTable {
    [key: string]: StructDeclaration;
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

export function fillUp(s: LinkedNode<Statement>, symbols: SymbolTable):
    [LinkedNode<Statement>, SymbolTable] {
    switch (s.current.kind) {
    case "ReturnStatement":
        [s.current.expression, symbols] = fillUpExpressionTypeInfo(s.current.expression, symbols);
        break;
    case "AssignmentStatement":
        switch (s.current.variable.kind) {
        case "VariableDeclaration":
            if (s.current.variable.typeExpected === null) {
                // Inference-typed
                [s.current.expression, symbols] = fillUpExpressionTypeInfo(s.current.expression, symbols);
                s.current.variable.variable.returnType = s.current.expression.returnType;
            } else {
                // Statically-typed
                s.current.expression.returnType = s.current.variable.typeExpected;
                s.current.variable.variable.returnType = s.current.variable.typeExpected;
            }
            symbols.vartab = updateVariableTable(symbols.vartab, s.current.variable.variable);
            break;
        case "Variable":
            const matching = symbols.vartab[s.current.variable.repr];
            [s.current.expression, symbols] = fillUpExpressionTypeInfo(s.current.expression, symbols);
            if (!typeEquals(matching.returnType, s.current.expression.returnType)) {
                errorMessage(
`The data type of ${matching.repr} should be ${stringifyType(matching.returnType)}, ` +
`but you assigned it with ${stringifyType(s.current.expression.returnType)}`, matching.location);
            } else {
                s.current.variable.returnType = matching.returnType;
            }
            break;
        }
        break;
    case "FunctionCall":
        [s.current, symbols.functab] = fillUpFunctionCallTypeInfo(s.current, symbols);
        break;
    case "BranchStatement":
        [s.current, symbols] = fillUpBranchTypeInfo(s.current, symbols);
        break;
    case "ForStatement":
        [s.current, symbols] = fillUpForStmtTypeInfo(s.current, symbols);
        break;
    case "WhileStatement":
        [s.current.test, symbols] = fillUpTestExprTypeInfo(s.current.test, symbols);
        [s.current.body, symbols] = fillUp(s.current.body, symbols);
        break;
    }
    if (s.next !== null) {
        [s.next, symbols] = fillUp(s.next, symbols);
    }
    return [s, symbols];
}

export function fillUpForStmtTypeInfo(f: ForStatement, symbols: SymbolTable):
    [ForStatement, SymbolTable] {
    [f.expression, symbols] = fillUpExpressionTypeInfo(f.expression, symbols);
    if (f.expression.returnType.kind === "CompoundType") {
        f.iterator.returnType = f.expression.returnType.of.current;
        symbols.vartab = updateVariableTable(symbols.vartab, f.iterator);
    } else {
        errorMessage("The expresison type in for statement should be array.", null);
    }
    [f.body, symbols] = fillUp(f.body, symbols);
    return [f, symbols];
}

export function fillUpTestExprTypeInfo(t: TestExpression, symbols: SymbolTable):
    [TestExpression, SymbolTable] {
    [t.current, symbols.functab] = fillUpFunctionCallTypeInfo(t.current, symbols);
    let next = t.next;
    while (next !== null) {
        [next.current, symbols.functab] = fillUpFunctionCallTypeInfo(next.current, symbols);
        next = next.next;
    }
    return [t, symbols];
}

export function fillUpBranchTypeInfo(b: BranchStatement, symbols: SymbolTable):
    [BranchStatement, SymbolTable] {
    [b.body, symbols] = fillUp(b.body, symbols);
    if (b.test !== null) {
        [b.test, symbols] = fillUpTestExprTypeInfo(b.test, symbols);
    }
    if (b.elseBranch !== null) {
        [b.elseBranch, symbols] = fillUpBranchTypeInfo(b.elseBranch, symbols);
    }
    return [b, symbols];
}

export function fillUpExpressionTypeInfo(e: Expression, symbols: SymbolTable):
    [Expression, SymbolTable] {
    switch (e.kind) {
        case "FunctionCall":
            [e, symbols.functab] = fillUpFunctionCallTypeInfo(e, symbols);
            return [e, symbols];
        case "List":            e = fillUpArrayTypeInfo       (e, symbols); break;
        case "Number":          e = fillUpSimpleTypeInfo      (e, "Number"); break;
        case "String":          e = fillUpSimpleTypeInfo      (e, "String"); break;
        case "Boolean":         e = fillUpSimpleTypeInfo      (e, "Boolean"); break;
        case "Variable":        e = fillUpVariableTypeInfo    (e, symbols.vartab); break;
        case "ListAccess":
            [e.subject, symbols] = fillUpExpressionTypeInfo(e.subject, symbols);
            e = fillUpArrayAccessTypeInfo(e);
            break;
        case "ObjectExpression":
            if (e.constructor !== null) {
                e.returnType = getStruct(e.constructor.repr, symbols.structTab);
                checkIfKeyValueListConforms(e.keyValueList, e.returnType);
            } else {
                e.returnType = newSimpleType("Dict");
            }
            [e.keyValueList, symbols] = fillUpKeyValueListTypeInfo(e.keyValueList, symbols);
            break;
        case "ObjectAccess":
            [e.subject, symbols] = fillUpExpressionTypeInfo(e.subject, symbols);
            switch (e.subject.returnType.kind) {
            case "StructDeclaration":
                e.returnType = findMemberType( e.key.repr, e.subject.returnType);
                break;
            case "SimpleType":
                if (e.subject.returnType.name.repr === "Dict") {
                    throw new Error("Unimplemented yet");
                } else {
                    throw new Error("Must be dictionary type");
                }
                break;
            default:
                throw new Error("Must be dictionary type of object type");
            }
            break;
        default:
            throw new Error("Unimplemented yet");
    }
    return [e, symbols];
}

export function checkIfKeyValueListConforms(
    keyValues: LinkedNode<KeyValue>,
    structDecl: StructDeclaration
): void {
    const kvs = flattenLinkedNode(keyValues).map((x) => x.memberName.repr);
    const members = flattenLinkedNode(structDecl.members).map((x) => x.name.repr);

    // Check if every declared member is in member definitions
    for (let i = 0; i < kvs.length; i++) {
        if (!find(kvs[i], /*in*/ members)) {
            throw new Error(`Key ${kvs[i]} is not found in ${structDecl.name.repr}`);
        }
    }

    // Check if every member definition is present in declared member
    for (let i = 0; i < members.length; i++) {
        if (!find(members[i], /*in*/ kvs)) {
            throw new Error(`Missing key ${members[i]} for ${structDecl.name.repr} type`);
        }
    }
}

export function findMemberType(key: string, structDecl: StructDeclaration): TypeExpression {
    const members = flattenLinkedNode(structDecl.members);
    const matchingMember = members.filter((x) => x.name.repr === key);
    if (matchingMember.length > 0) {
        return matchingMember[0].expectedType;
    } else {
        throw new Error(`${structDecl.name.repr} does not have member ${key}`);
    }
}
export function getStruct(name: string, structTab: StructTable): StructDeclaration {
    const result = structTab[name];
    if (result !== undefined) {
        return result;
    } else {
        throw new Error(`Cannot find struct ${name}`);
    }
}

export function fillUpKeyValueListTypeInfo(k: LinkedNode<KeyValue>, symbols: SymbolTable)
    : [LinkedNode<KeyValue>, SymbolTable] {
    let current: LinkedNode<KeyValue> | null = k;
    while (current !== null) {
        [current.current.expression, symbols] = fillUpExpressionTypeInfo(current.current.expression, symbols);
        current = current.next;
    }
    return [k, symbols];
}

export function fillUpArrayAccessTypeInfo(a: ListAccess): ListAccess {
    switch (a.subject.returnType.kind) {
        case "SimpleType":
            throw new Error("Cannot index simple type");
            break;
        case "CompoundType":
            if (a.subject.returnType.name.repr === "List") {
                a.returnType = a.subject.returnType.of.current;
            } else {
                throw new Error("Cannot index non-array type");
            }
            break;
    }
    return a;
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

export function fillUpFunctionCallTypeInfo(e: FunctionCall, symbols: SymbolTable):
    [FunctionCall, FunctionTable] {
    for (let i = 0; i < e.parameters.length; i++) {
        [e.parameters[i], symbols] = fillUpExpressionTypeInfo(e.parameters[i], symbols);
    }
    return getFuncSignature(e, symbols.functab, symbols.typeTree);
}

export function getFuncSignature(f: FunctionCall, functab: FunctionTable, typetree: TypeTree)
    : [FunctionCall, FunctionTable] {
    const key = stringifyFuncSignature(f.signature);
    if (key in functab) {
        const matchingFunctions = functab[key];
        const closestFunction = getClosestFunction(f, matchingFunctions, typetree);
        if (closestFunction !== null) {
            // This step is necessary to fix parent type
            // E.g., changing (Number -> Number) to (Any -> Number)
            for (let j = 0; j < f.parameters.length; j++) {
                f.parameters[j].returnType =
                   closestFunction.parameters[j].typeExpected;
            }
            f.returnType = closestFunction.returnType;
            functab = newFunctionTable(closestFunction, functab) ;
            return [f, functab];
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
    let closestFunction: FunctionDeclaration | null = null;
    let minimumDistance = Number.MAX_VALUE;
    for (let i = 0; i < matchingFunctions.length; i++) {
        const currentFunc = copy(matchingFunctions[i]);
        const matchingParams = f.parameters;
        if (containsGeneric(currentFunc.parameters)) {
            currentFunc.parameters = substituteGeneric(currentFunc.parameters, matchingParams);
            currentFunc.returnType = substitute(matchingParams[0].returnType, currentFunc.returnType);
        }
        const distance = paramTypesConforms(currentFunc.parameters, matchingParams, typeTree);
        if (distance < 99 && distance < minimumDistance) {
            closestFunction = currentFunc;
            minimumDistance = distance;
        }
    }
    // more than 99 means no matching parent
    return closestFunction || null;
}

export function paramTypesConforms(
    actualParams: VariableDeclaration[],
    matchingParams: Expression[],
    typeTree: TypeTree
): number {
    // prettyPrint(actualParams, true);
    // prettyPrint(matchingParams, true);
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

function containsGeneric(params: VariableDeclaration[]): boolean {
    return params.some((x) => JSON.stringify(x).indexOf("GenericType") > -1);
}

function substituteGeneric(actualParams: VariableDeclaration[], matchingParams: Expression[]): VariableDeclaration[] {
    const typeOfFirstParam = matchingParams[0].returnType;
    for (let i = 0; i < actualParams.length; i++) {
        actualParams[i].typeExpected = substitute(typeOfFirstParam, /*into*/ actualParams[i].typeExpected);
    }
    return actualParams;

}

function substitute(src: TypeExpression, /*into*/ dest: TypeExpression): TypeExpression {
    const matchingType = (() => {
        let current = src;
        while (current.kind === "CompoundType") {
            current = current.of.current;
        }
        return current;
    })();
    switch (dest.kind) {
        case "CompoundType":
            dest.of.current = substitute(matchingType, dest.of.current);
            break;
        case "FunctionType":
            dest.inputType = dest.inputType.map((x) => substitute(matchingType, x));
            dest.outputType = substitute(matchingType, dest.outputType);
            break;
        case "GenericType":
            return matchingType;
            break;
        case "SimpleType":
            // do nothing
            break;
    }
    return dest;
}

export function fillUpArrayTypeInfo(e: ListExpression, symbols: SymbolTable): ListExpression {
    if (e.elements !== null) {
        [e.elements, symbols] = fillUpElementsType(e.elements, symbols);
        e.returnType = getElementsType(e.elements);
    } else {
        throw new Error("Don't know how to handle yet");
    }
    return e;
}

export function fillUpElementsType(e: LinkedNode<Expression>, symbols: SymbolTable):
    [LinkedNode<Expression>, SymbolTable] {
    let current: LinkedNode<Expression> | null = e;
    while (current !== null) {
        [current.current, symbols] = fillUpExpressionTypeInfo(current.current, symbols);
        current = current.next;
    }
    return [e, symbols];
}

export function getElementsType(a: LinkedNode<Expression>): CompoundType {
    const types = flattenLinkedNode(a).map((x) => x.returnType);
    checkIfAllElementTypeAreHomogeneous(types);
    return {
        kind: "CompoundType",
        name: {
            repr: "List",
            location: null
        },
        of: {
            current: types[0],
            next: null
        },
        nullable: false
    };
}

export function checkIfAllElementTypeAreHomogeneous(ts: TypeExpression[]): void {
    if (ts.some((x) => !typeEquals(x, ts[0]))) {
        throw new Error("Every element in an array should have the same type");
    }
    // TODO: Check if every element is of the same type
}

export function typeEquals(x: TypeExpression, y: TypeExpression): boolean {
    return stringifyType(x) === stringifyType(y);
}

function copy<T>(x: T): T {
    return JSON.parse(JSON.stringify(x));
}
