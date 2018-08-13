import {
    AtomicToken,
    BranchStatement,
    Declaration,
    EnumDeclaration,
    Expression,
    ForStatement,
    FunctionCall,
    FunctionDeclaration,
    KeyValue,
    LinkedNode,
    ListExpression,
    newAtomicToken,
    newSimpleType,
    NullTokenLocation,
    NumberExpression,
    ReturnStatement,
    SimpleType,
    singleLinkedNode,
    Statement,
    StringExpression,
    StructDeclaration,
    TestExpression,
    TokenLocation,
    TypeExpression,
    Variable,
    VariableDeclaration
} from "./ast";

import { ErrorAccessingInexistentMember } from "./errorType/E0001-AccessingInexistentMember";
import { ErrorAssigningToImmutableVariable } from "./errorType/E0002-AssigningToImmutableVariable";
import { ErrorDuplicatedMember } from "./errorType/E0003-DuplicatedMember";
import { ErrorExtraMember } from "./errorType/E0004-ExtraMember";
import { ErrorIncorrectTypeGivenForMember } from "./errorType/E0005-IncorrectTypeGivenForMember";
import { ErrorIncorrectTypeGivenForVariable } from "./errorType/E0006-IncorrectTypeGivenForVariable";
import { ErrorMissingMember } from "./errorType/E0007-ErrorMissingMember";
import { ErrorNoConformingFunction } from "./errorType/E0008-NoConformingFunction";
import { ErrorStructRedeclare } from "./errorType/E0009-StructRedeclare";
import { ErrorUnmatchingReturnType } from "./errorType/E0011-UnmatchingReturnType";
import { ErrorUsingUndefinedStruct } from "./errorType/E0012-UsingUndefinedStruct";
import { ErrorUsingUnknownFunction } from "./errorType/E0013-UsingUnknownFunction";
import { ErrorVariableRedeclare } from "./errorType/E0014-VariableRedeclare";
import { ErrorEnumRedeclare } from "./errorType/E0015-EnumRedeclare";
import { ErrorNonVoidExprNotAssignedToVariable } from "./errorType/E0016-NonVoidExprNotAssignedToVariable";
import { ErrorDetail, stringifyTypeReadable } from "./errorType/errorUtil";
import { renderError } from "./errorType/renderError";
import { convertToLinkedNode, flattenLinkedNode } from "./getIntermediateForm";
import { SourceCode } from "./interpreter";
import { prettyPrint } from "./pine2js";
import { stringifyFuncSignature, stringifyType, tpFunctionDeclaration } from "./transpile";
import {
    childOf,
    Comparer,
    EmptyListType,
    EnumType,
    includes,
    insertChild,
    newListType,
    ObjectType,
    Tree,
    verticalDistance,
    VoidType
} from "./typeTree";
import { find } from "./util";

let CURRENT_SOURCE_CODE: () => SourceCode;
export function fillUpTypeInformation(
        decls: Declaration[],
        sourceCode: SourceCode,
        symbols: SymbolTable
    ): [Declaration[], SymbolTable] {

    CURRENT_SOURCE_CODE = () => sourceCode;
    // Complete the function and struct table
    // This step is to allow programmer to define function anywhere
    // without needing to adhere to strict top-down or bottom-up structure
    for (let i = 0; i < decls.length; i++) {
        const currentDecl = decls[i];
        currentDecl.originFile = CURRENT_SOURCE_CODE().filename;
        switch (currentDecl.kind) {
            case "FunctionDeclaration":
                currentDecl.returnType = resolveType(currentDecl.returnType, symbols);
                for (let j = 0; j < currentDecl.parameters.length; j++) {
                    currentDecl.parameters[j].typeExpected =
                        resolveType(currentDecl.parameters[j].typeExpected, symbols);
                }
                symbols.funcTab = newFunctionTable(currentDecl, symbols.funcTab);
                break;
            case "StructDeclaration":
                symbols.structTab = newStructTab(currentDecl, symbols.structTab);
                symbols.typeTree = insertChild(currentDecl, ObjectType(), symbols.typeTree, typeEquals);
                break;
            case "EnumDeclaration":
                symbols.enumTab = newEnumTab(currentDecl, symbols.enumTab);
                symbols.typeTree = insertChild(currentDecl, EnumType(), symbols.typeTree, typeEquals);
        }
    }

    for (let i = 0; i < decls.length; i++) {
        const currentDecl = decls[i];
        switch (currentDecl.kind) {
            case "FunctionDeclaration":
                const vartab = getVariableTable(currentDecl.parameters);
                const [statements, newSymbols] = fillUp(currentDecl.statements, symbols, vartab);
                currentDecl.statements = statements;
                symbols = newSymbols;
                verifyFunctionDeclaration(currentDecl);
                break;
        }
    }
    return [decls, symbols];
}

export function newEnumTab(e: EnumDeclaration, enumTab: EnumTable): EnumTable {
    if (enumTab[e.name.repr]) {
        raise(ErrorEnumRedeclare(e, enumTab[e.name.repr].originFile));
    } else {
        enumTab[e.name.repr] = e;
    }
    return enumTab;
}

export function findTableEntry<T>(table: TableOf<T>, key: string): T | null {
    const matchingKey = Object.keys(table).filter((x) => x === key)[0];
    if (matchingKey) {
        return table[matchingKey];
    } else {
        return null;
    }
}

export function resolveType(
    t: TypeExpression | null,
    symbols: SymbolTable
): TypeExpression {
    if (t === null) {
        return VoidType();
    }
    switch (t.kind) {
        case "SimpleType":
        // Fall through to StructDeclaration to search for matching struct
        case "StructDeclaration":
            // check type tree
            if (includes(symbols.typeTree, t, typeEquals)) {
                return t;
            }

            const mathchingEnum = findTableEntry(symbols.enumTab, t.name.repr);
            if (mathchingEnum) {
                return mathchingEnum;
            }
            const mathchingStruct = findTableEntry(symbols.structTab, t.name.repr);
            if (mathchingStruct) {
                return mathchingStruct;
            } else {
                throw new Error("There is no such type " + t.name.repr);
            }
        case "VoidType":
            return {
                kind: "VoidType",
                location: NullTokenLocation()
            };
        case "GenericType":
            return t;
        default:
            // search struct table
            throw new Error(`${t.kind} can't be resolved yet`); // TODO: implement it
    }
}

export function newStructTab(s: StructDeclaration, structTab: StructTable): StructTable {
    if (s.name.repr in structTab) {
        raise(ErrorStructRedeclare(s));
    } else {
        structTab[s.name.repr] = s;
    }
    return structTab;
}

export function newFunctionTable(
    newFunc: FunctionDeclaration,
    previousFuncTab: FunctionTable,
): FunctionTable {
    const key = stringifyFuncSignature(newFunc.signature);
    if (newFunc.returnType === null) {
        newFunc.returnType = {kind: "VoidType", location: NullTokenLocation()};
    }
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

export function verifyFunctionDeclaration(f: FunctionDeclaration) {
    // Check if return statements are correct
    const returnStatements =
        flattenLinkedNode(f.statements).filter((x) => x.kind === "ReturnStatement") as ReturnStatement[];
    for (let i = 0; i < returnStatements.length; i++) {
        const r = returnStatements[i];
        if (!typeEquals(r.expression.returnType, f.returnType)) {
            raise(ErrorUnmatchingReturnType(r, f.returnType));
        }
    }
}

export function functionEqual(x: FunctionDeclaration, y: FunctionDeclaration): boolean {
    if (stringifyFuncSignature(x.signature) !== stringifyFuncSignature(y.signature)) {
        return false;
    } else if (x.parameters.length !== y.parameters.length) {
        return false;
    } else {
        for (let i = 0; i < x.parameters.length; i++) {
            if (
                stringifyTypeReadable(x.parameters[i].typeExpected) !==
                stringifyTypeReadable(y.parameters[i].typeExpected)
            ) {
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
        variables[i].variable.isMutable = variables[i].isMutable;
        result[variables[i].variable.repr] = variables[i].variable;
    }
    return result;
}

export interface SymbolTable {
    funcTab: FunctionTable;
    structTab: StructTable;
    typeTree: Tree<TypeExpression>;
    enumTab: EnumTable;
}

export interface TableOf<T> {
    [key: string]: T;
}

export type StructTable   = TableOf<StructDeclaration>;
export type VariableTable = TableOf<Variable>;
export type FunctionTable = TableOf<FunctionDeclaration[]>;
export type EnumTable     = TableOf<EnumDeclaration>;

function updateVariableTable(vtab: VariableTable, variable: Variable): VariableTable {
    const initialVariable = vtab[variable.repr];
    if (initialVariable !== undefined) {
        raise(ErrorVariableRedeclare(initialVariable, variable));
    }
    vtab[variable.repr] = variable;
    return vtab;
}

export function raise(errorDetail: ErrorDetail, sourceCode: SourceCode = CURRENT_SOURCE_CODE()): any {
    const e = Error(renderError(sourceCode, errorDetail));
    e.name = errorDetail.name;
    throw e;
}

export function fillUp(s: LinkedNode<Statement>, symbols: SymbolTable, vartab: VariableTable):
    [LinkedNode<Statement>, SymbolTable] {
    switch (s.current.kind) {
    case "ReturnStatement":
        [s.current.expression, symbols] = fillUpExpressionTypeInfo(s.current.expression, symbols, vartab);
        break;
    case "AssignmentStatement":
        switch (s.current.variable.kind) {
        case "VariableDeclaration":
            if (s.current.variable.typeExpected === null) {
                // Inference-typed
                [s.current.expression, symbols] = fillUpExpressionTypeInfo(s.current.expression, symbols, vartab);
                s.current.variable.variable.returnType = s.current.expression.returnType;
            } else {
                // Statically-typed
                s.current.variable.typeExpected = resolveType(s.current.variable.typeExpected, symbols);
                [s.current.expression, symbols] = fillUpExpressionTypeInfo(s.current.expression, symbols, vartab);
                s.current.variable.variable.returnType = s.current.variable.typeExpected;
                const exprType = s.current.expression.returnType;
                const expectedType = s.current.variable.typeExpected;
                if (childOf(exprType, expectedType, symbols.typeTree, typeEquals) === null) {
                    raise(ErrorIncorrectTypeGivenForVariable(
                        s.current.variable.variable,
                        s.current.variable.typeExpected,
                        s.current.expression
                    ));
                }
            }
            s.current.variable.variable.isMutable = s.current.variable.isMutable;
            vartab = updateVariableTable(vartab, s.current.variable.variable);
            break;
        case "Variable":
            const matching = findVariable(s.current.variable, vartab);
            if (!matching.isMutable) {
                raise(ErrorAssigningToImmutableVariable(s.current.variable));
            }
            [s.current.expression, symbols] = fillUpExpressionTypeInfo(s.current.expression, symbols, vartab);
            if (!isSubtypeOf(s.current.expression.returnType, matching.returnType, symbols.typeTree, typeEquals)) {
                raise(ErrorIncorrectTypeGivenForVariable(
                    s.current.variable,
                    matching.returnType,
                    s.current.expression
                ));
            } else {
                s.current.variable.returnType = matching.returnType;
            }
            break;
        }
        break;
    case "FunctionCall":
        [s.current, symbols.funcTab] = fillUpFunctionCallTypeInfo(s.current, symbols, vartab);
        if (s.current.returnType.kind !== "VoidType") {
            raise(ErrorNonVoidExprNotAssignedToVariable(s.current));
            throw new Error("Non void function should be assign to new variable");
        }
        break;
    case "BranchStatement":
        [s.current, symbols] = fillUpBranchTypeInfo(s.current, symbols, vartab);
        break;
    case "ForStatement":
        [s.current, symbols, vartab] = fillUpForStmtTypeInfo(s.current, symbols, vartab);
        break;
    case "WhileStatement":
        [s.current.test, symbols] = fillUpTestExprTypeInfo(s.current.test, symbols, vartab);
        [s.current.body, symbols] = fillUp(s.current.body, symbols, vartab);
        break;
    }
    if (s.next !== null) {
        [s.next, symbols] = fillUp(s.next, symbols, vartab);
    }
    return [s, symbols];
}

function findVariable(v: Variable, vartab: VariableTable): Variable {
    const matching = vartab[v.repr];
    if (matching === undefined) {
        throw new Error(`Variable ${v.repr} does not exist.`);
    } else {
        return matching;
    }
}

export function fillUpForStmtTypeInfo(f: ForStatement, symbols: SymbolTable, vartab: VariableTable):
    [ForStatement, SymbolTable, VariableTable] {
    [f.expression, symbols] = fillUpExpressionTypeInfo(f.expression, symbols, vartab);
    const exprType = f.expression.returnType;
    if (exprType.kind === "StructDeclaration" && exprType.name.repr === "List") {
        if (exprType.templates !== null) {
            f.iterator.returnType = exprType.templates.current;
        } else {
            throw new Error("Something is wrong");
        }
        vartab = updateVariableTable(vartab, f.iterator);
    } else {
        throw new Error("The expresison type in for statement should be array.");
    }
    [f.body, symbols] = fillUp(f.body, symbols, vartab);
    return [f, symbols, vartab];
}

export function fillUpTestExprTypeInfo(t: TestExpression, symbols: SymbolTable, vartab: VariableTable):
    [TestExpression, SymbolTable] {
    [t.current, symbols.funcTab] = fillUpFunctionCallTypeInfo(t.current, symbols, vartab);
    let next = t.next;
    while (next !== null) {
        [next.current, symbols.funcTab] = fillUpFunctionCallTypeInfo(next.current, symbols, vartab);
        next = next.next;
    }
    return [t, symbols];
}

export function fillUpBranchTypeInfo(b: BranchStatement, symbols: SymbolTable, vartab: VariableTable):
    [BranchStatement, SymbolTable] {
    [b.body, symbols] = fillUp(b.body, symbols, vartab);
    if (b.test !== null) {
        [b.test, symbols] = fillUpTestExprTypeInfo(b.test, symbols, vartab);
    }
    if (b.elseBranch !== null) {
        [b.elseBranch, symbols] = fillUpBranchTypeInfo(b.elseBranch, symbols, vartab);
    }
    return [b, symbols];
}

export function fillUpExpressionTypeInfo(e: Expression, symbols: SymbolTable, vartab: VariableTable):
    [Expression, SymbolTable] {
    switch (e.kind) {
    case "FunctionCall":
        [e, symbols.funcTab] = fillUpFunctionCallTypeInfo(e, symbols, vartab);
        return [e, symbols];
    case "List":
        e = fillUpArrayTypeInfo(e, symbols, vartab);
        break;
    case "Number":
        if (e.repr.indexOf(".") >= 0) {
            e = fillUpSimpleTypeInfo(e, "Number");
        } else {
            e = fillUpSimpleTypeInfo(e, "Int");
        }
        break;
    case "String":   e = fillUpSimpleTypeInfo  (e, "String"); break;
    case "Variable": e = fillUpVariableTypeInfo(e, vartab); break;
    case "ObjectExpression":
        if (e.constructor !== null) {
            e.returnType = getStruct(e.constructor, symbols.structTab);
            [e.keyValueList, symbols] = fillUpKeyValueListTypeInfo(e.keyValueList, symbols, vartab);
            checkIfKeyValueListConforms(e.keyValueList, e.returnType, symbols.typeTree);
        } else {
            e.returnType = newSimpleType("Dict");
        }
        break;
    case "ObjectAccess":
        [e.subject, symbols] = fillUpExpressionTypeInfo(e.subject, symbols, vartab);
        switch (e.subject.returnType.kind) {
        case "StructDeclaration":
            e.returnType = findMemberType( e.key, e.subject.returnType);
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
        case "EnumExpression":
            e.returnType = findMatchingEnumType(e.value.repr, symbols.enumTab);
            break;
    default:
        throw new Error(`Unimplemented yet for ${e.kind}`);
    }
    return [e, symbols];
}

export function findMatchingEnumType(value: string, enumTab: EnumTable): EnumDeclaration {
    const matchingEnum: EnumDeclaration[] = [];
    for (const key in enumTab) {
        if (enumTab.hasOwnProperty(key)) {
            if (flattenLinkedNode(enumTab[key].enums).some((x) => x.repr === value)) {
                matchingEnum.push(enumTab[key]);
            }
        }
    }
    if (matchingEnum.length === 0) {
        throw new Error(`There are no enum that has the value of ${value}`);
    } else if (matchingEnum.length > 1) {
        throw new Error(`There are more than one enum that have the value of ${value}`);
    } else {
        return matchingEnum[0];
    }
}

/**
 * Check if x is subtype of y
 */
export function isSubtypeOf(
    x: TypeExpression,
    y: TypeExpression,
    tree: Tree<TypeExpression>,
    comparer: Comparer<TypeExpression>

): boolean {
    return typeEquals(x, y) || childOf(x, y, tree, comparer) !== null;
}

export function checkIfKeyValueListConforms(
    keyValues: LinkedNode<KeyValue> | null,
    structDecl: StructDeclaration,
    tree: Tree<TypeExpression>
): void {
    const kvs = flattenLinkedNode(keyValues);
    const members = flattenLinkedNode(structDecl.members);

    // Check if every declared member is in member definitions
    for (let i = 0; i < kvs.length; i++) {
        const matchingMember = find(kvs[i], members, (k, m) => k.memberName.repr === m.name.repr);
        if (matchingMember === null) {
            raise(ErrorExtraMember(kvs[i].memberName, structDecl));
        } else {
            // Check if type are equals to expected
            const exprType = kvs[i].expression.returnType;
            const expectedType = matchingMember.expectedType;
            if (!isSubtypeOf(exprType, expectedType, tree, typeEquals)) {
                raise(ErrorIncorrectTypeGivenForMember(matchingMember.expectedType, kvs[i]));
            }
        }
    }

    // Check if every member definition is present in declared member
    for (let i = 0; i < members.length; i++) {
        if (!find(members[i], kvs, (m, k) => m.name.repr === k.memberName.repr)) {
            raise(ErrorMissingMember(members[i].name.repr, structDecl, kvs[0].memberName.location));
        }
    }

    // Check if there are duplicated members
    const valuesSoFar: {[key: string]: AtomicToken} = {};
    for (let i = 0; i < kvs.length; ++i) {
        const member = kvs[i].memberName;
        if (valuesSoFar[member.repr]) {
            raise(ErrorDuplicatedMember(member, valuesSoFar[member.repr]));
        }
        valuesSoFar[member.repr] = member;
    }
}

export function findMemberType(key: AtomicToken, structDecl: StructDeclaration): TypeExpression {
    const members = flattenLinkedNode(structDecl.members);
    const matchingMember = members.filter((x) => x.name.repr === key.repr);
    if (matchingMember.length > 0) {
        return matchingMember[0].expectedType;
    } else {
        return raise(ErrorAccessingInexistentMember(structDecl, key));
    }
}
export function getStruct(name: AtomicToken, structTab: StructTable): StructDeclaration {
    const result = structTab[name.repr];
    if (result !== undefined) {
        return result;
    } else {
        return raise(ErrorUsingUndefinedStruct(name, structTab));
    }
}

export function fillUpKeyValueListTypeInfo(k: LinkedNode<KeyValue> | null, symbols: SymbolTable, vartab: VariableTable)
    : [LinkedNode<KeyValue> | null, SymbolTable] {
    let current: LinkedNode<KeyValue> | null = k;
    while (current !== null) {
        [current.current.expression, symbols] = fillUpExpressionTypeInfo(current.current.expression, symbols, vartab);
        current = current.next;
    }
    return [k, symbols];
}

export function fillUpVariableTypeInfo(e: Variable, vartab: VariableTable): Variable {
    const matching = findVariable(e, vartab);
    e.returnType = matching.returnType;
    return e;
}

export type SimpleExpression
    = NumberExpression
    | StringExpression
    ;

export function fillUpSimpleTypeInfo(e: SimpleExpression, name: string): SimpleExpression {
    return {
        ...e,
        returnType: newSimpleType(name)
    };
}

export function fillUpFunctionCallTypeInfo(e: FunctionCall, symbols: SymbolTable, vartab: VariableTable):
    [FunctionCall, FunctionTable] {
    for (let i = 0; i < e.parameters.length; i++) {
        [e.parameters[i], symbols] = fillUpExpressionTypeInfo(e.parameters[i], symbols, vartab);
    }
    return getFuncSignature(e, symbols.funcTab, symbols.typeTree);
}

export function getFuncSignature(f: FunctionCall, functab: FunctionTable, typetree: Tree<TypeExpression>)
    : [FunctionCall, FunctionTable] {
    const key = stringifyFuncSignature(f.signature);
    if (key in functab) {
        const matchingFunctions = functab[key].filter((x) => x.parameters.length === f.parameters.length);
        const closestFunction = getClosestFunction(f, matchingFunctions, typetree);
        // This step is necessary to fix parent type
        // E.g., changing (Number -> Number) to (Any -> Number)
        for (let j = 0; j < f.parameters.length; j++) {
            f.parameters[j].returnType =
                closestFunction.parameters[j].typeExpected;
        }
        f.returnType = closestFunction.returnType;

        // this step is needed for generic substituted function
        functab = newFunctionTable(closestFunction, functab) ;

        return [f, functab];
    } else {
        return raise(ErrorUsingUnknownFunction(f));
    }
}

export function getClosestFunction(
    f: FunctionCall,
    matchingFunctions: FunctionDeclaration[],
    typeTree: Tree<TypeExpression>
): FunctionDeclaration {
    const paramLength = f.parameters.length;
    // First, find function that have the exact type signature with the calling signature
    for (let i = 0; i < matchingFunctions.length; i++) {
        const matchingFunc = matchingFunctions[i];
        let gotConflict = false;
        for (let j = 0; j < paramLength; j++) {
            if (!typeEquals(
                f.parameters[j].returnType,
                matchingFunc.parameters[j].typeExpected,
                false // Dont ignore generic
            )) {
                gotConflict = true;
            }
        }
        if (!gotConflict) {
            return matchingFunc;
        }
    }

    // If can't find exactly matching function, find the closest function
    let closestFunction: FunctionDeclaration | null = null;
    let minimumDistance = Number.MAX_VALUE;
    const errors: Array<{paramPosition: number}> = [];
    const relatedFuncs: FunctionDeclaration[] = [];
    for (let i = 0; i < matchingFunctions.length; i++) {
        const currentFunc = copy(matchingFunctions[i]);
        const matchingParams = f.parameters;
        if (containsGeneric(currentFunc.parameters)) {
            const genericsBinding = extractGenericBinding(currentFunc.parameters, f.parameters);
            if (genericsBinding !== null) {
                for (let j = 0; j < currentFunc.parameters.length; j++) {
                    currentFunc.parameters[j].typeExpected =
                        substituteGeneric(
                            currentFunc.parameters[j].typeExpected,
                            genericsBinding
                        );
                }
                currentFunc.returnType = substituteGeneric(
                    currentFunc.returnType,
                    genericsBinding
                );
            }
        }
        const [distance, error] = paramTypesConforms(currentFunc.parameters, matchingParams, typeTree);
        if (error === null) {
            if (distance < minimumDistance) {
                closestFunction = currentFunc;
                minimumDistance = distance;
            }
        } else {
            relatedFuncs.push(currentFunc);
            errors.push(error);
        }
    }
    if (closestFunction === null) {
        const farthestMatchingParamPosition =
            errors.sort((x, y) => x.paramPosition - y.paramPosition)[0].paramPosition;
        return raise(ErrorNoConformingFunction(
            f,
            farthestMatchingParamPosition,
            f.parameters[farthestMatchingParamPosition],
            relatedFuncs.map((x) => x.parameters[farthestMatchingParamPosition].typeExpected)
        ));
    } else {
        return closestFunction;
    }
}

export function extractGenericBinding(
    genericParams: VariableDeclaration[],
    actualParams: Expression[]
): {[templateName: string]: TypeExpression} | null {
    // reverse is needed, so that the the type of first param can override later types
    const genericParamss = genericParams.slice().reverse();
    const actualParamss = actualParams.slice().reverse();
    let result: TableOf<TypeExpression> = {};
    if (genericParamss.length !== actualParamss.length) {
        return null;
    } else {
        for (let i = 0; i < genericParamss.length; i++) {
            result = {
                ...result,
                ...extract(genericParamss[i].typeExpected, actualParamss[i].returnType)
            };
        }
        return result;
    }
}

function extract(genericType: TypeExpression, actualType: TypeExpression): TableOf<TypeExpression> {
    let result: TableOf<TypeExpression> = {};
    switch (genericType.kind) {
        case "GenericType":
            result[genericType.placeholder.repr] = actualType;
            break;
        case "StructDeclaration":
            const templates = flattenLinkedNode(genericType.templates);
            if (actualType.kind === "StructDeclaration") {
                for (let j = 0; j < templates.length; j++) {
                    result = {
                        ...result,
                        ...extract(templates[j], flattenLinkedNode(actualType.templates)[j])
                    };
                }
            }
            break;
        default:  /*no substituion required*/ break;
    }
    return result;
}

export function paramTypesConforms(
    expectedParams: VariableDeclaration[],
    actualParams: Expression[],
    typeTree: Tree<TypeExpression>
): [number, {paramPosition: number /*zero-based*/}|null] {
    let resultScore = 0;
    for (let i = 0; i < expectedParams.length; i++) {
        const expectedType = expectedParams[i].typeExpected;
        const actualType = actualParams[i].returnType;
        const score = childOf(actualType, expectedType, typeTree, typeEquals);
        if (score !== null) {
            resultScore += score;
        } else {
            return [99, {paramPosition: i}];
        }
    }
    return [resultScore, null];
}

function containsGeneric(params: VariableDeclaration[]): boolean {
    return params.some((x) => JSON.stringify(x).indexOf("GenericType") > -1);
}

function substituteGeneric(
    genericType: TypeExpression,
    genericBinding: TableOf<TypeExpression>
): TypeExpression {
    switch (genericType.kind) {
        case "GenericType":
            return genericBinding[genericType.placeholder.repr];
        case "StructDeclaration":
            const templates = flattenLinkedNode(genericType.templates);
            for (let i = 0; i < templates.length; i++) {
                templates[i] = substituteGeneric(templates[i], genericBinding);
            }
            genericType.templates = convertToLinkedNode(templates);
    }
    return genericType;
}

export function fillUpArrayTypeInfo(e: ListExpression, symbols: SymbolTable, vartab: VariableTable): ListExpression {
    if (e.elements !== null) {
        [e.elements, symbols] = fillUpElementsType(e.elements, symbols, vartab);
        e.returnType = getElementsType(e.elements);
    } else {
        e.returnType = EmptyListType();
    }
    return e;
}

export function fillUpElementsType(e: LinkedNode<Expression>, symbols: SymbolTable, vartab: VariableTable):
    [LinkedNode<Expression>, SymbolTable] {
    let current: LinkedNode<Expression> | null = e;
    while (current !== null) {
        [current.current, symbols] = fillUpExpressionTypeInfo(current.current, symbols, vartab);
        current = current.next;
    }
    return [e, symbols];
}

export function getElementsType(a: LinkedNode<Expression>): StructDeclaration {
    const types = flattenLinkedNode(a).map((x) => x.returnType);
    checkIfAllElementTypeAreHomogeneous(types);
    return newListType(types[0]) as StructDeclaration;
}

export function checkIfAllElementTypeAreHomogeneous(ts: TypeExpression[]): void {
    if (ts.some((x) => !typeEquals(x, ts[0]))) {
        throw new Error("Every element in an array should have the same type");
    }
    // TODO: Check if every element is of the same type
}

export function typeEquals(x: TypeExpression, y: TypeExpression, ignoreGeneric = true): boolean {
    if (x.kind !== y.kind) {
        return false;
    } else {
        switch (x.kind) {
            case "SimpleType":
            case "EnumDeclaration":
            case "StructDeclaration":
                x = x as StructDeclaration;
                y = y as StructDeclaration;
                if (x.name.repr !== y.name.repr) {
                    return false;
                } else {
                    const xOfTypes = flattenLinkedNode(x.templates);
                    const yOfTypes = flattenLinkedNode(y.templates);
                    for (let i = 0; i < xOfTypes.length; i++) {
                        if (ignoreGeneric) {
                            if (xOfTypes[i].kind === "GenericType") {
                                continue;
                            }
                            if (yOfTypes[i].kind === "GenericType") {
                                continue;
                            }
                        }
                        if (!typeEquals(xOfTypes[i], yOfTypes[i])) { // TODO: should use subtype of
                            return false;
                        }
                    }
                    return true;
                }
            case "GenericType":
                return true; // Is this correct?
            default:
                throw new Error(`Type comparison for ${x.kind} is not implemented yet`);
        }
    }
}

function copy<T>(x: T): T {
    return JSON.parse(JSON.stringify(x));
}

function getText(sourceCode: SourceCode, range: TokenLocation): string {
    const lines = sourceCode.content.split("\n").slice(range.first_line - 1, range.last_line);
    if (lines.length === 1) {
        return lines[0].slice(range.first_column - 1, range.last_column);
    } else {
        return lines.join("\n");
    }
}

export type SourceCodeExtractor = (x: TokenLocation) => string;
