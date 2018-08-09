import {
    AtomicToken,
    BranchStatement,
    CompoundType,
    Declaration,
    EnumDeclaration,
    Expression,
    ForStatement,
    FunctionCall,
    FunctionDeclaration,
    KeyValue,
    LinkedNode,
    ListExpression,
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
import { ErrorDetail } from "./errorType/errorUtil";
import { renderError } from "./errorType/renderError";
import { flattenLinkedNode } from "./getIntermediateForm";
import { SourceCode } from "./interpreter";
import { prettyPrint } from "./pine2js";
import { stringifyFuncSignature, stringifyType } from "./transpile";
import { childOf, EnumType, includes, insertChild, ListType, newListType, ObjectType, TypeTree } from "./typeTree";
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
        switch (currentDecl.kind) {
            case "FunctionDeclaration":
                symbols.funcTab = newFunctionTable(currentDecl, symbols.funcTab);
                break;
            case "StructDeclaration":
                symbols.typeTree = insertChild(currentDecl, ObjectType(), symbols.typeTree);
                symbols.structTab = newStructTab(currentDecl, symbols.structTab);
                break;
            case "EnumDeclaration":
                symbols.typeTree = insertChild(currentDecl, EnumType(), symbols.typeTree);
                symbols.enumTab = newEnumTab(currentDecl, symbols.enumTab);
        }
    }

    for (let i = 0; i < decls.length; i++) {
        const currentDecl = decls[i];
        switch (currentDecl.kind) {
            case "FunctionDeclaration":
                const vartab = getVariableTable(currentDecl.parameters);
                currentDecl.returnType = resolveType(currentDecl.returnType, symbols);
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
        throw new Error(`There is already an enum named ${e.name}`);
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
    t: TypeExpression,
    symbols: SymbolTable
): TypeExpression {
    switch (t.kind) {
        case "SimpleType":
            // check type tree
            if (includes(symbols.typeTree, t)) {
                return t;
            }

            // search struct table
            const mathchingStruct = findTableEntry(symbols.structTab, t.name.repr);
            if (mathchingStruct) {
                return mathchingStruct;
            }

            const mathchingEnum = findTableEntry(symbols.enumTab, t.name.repr);
            if (mathchingEnum) {
                return mathchingEnum;
            }

            // If can't find the type anywhere
            throw new Error("There is no such type " + t.name.repr);
        case "VoidType":
            return {
                kind: "VoidType",
                location: NullTokenLocation()
            };
        case "GenericType":
            return t;
        case "CompoundType":
            resolveType(t.container, symbols);
        default:
            throw new Error(`${t.kind} can't be resolved yet`); // TODO: implement it
    }
}

export function newStructTab(s: StructDeclaration, structTab: StructTable): StructTable {
    if (s.name.repr in structTab) {
        raise(ErrorStructRedeclare(s));
        // throw new Error(`${s.name.repr} is already defined.`);
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
        variables[i].variable.isMutable = variables[i].isMutable;
        result[variables[i].variable.repr] = variables[i].variable;
    }
    return result;
}

export interface SymbolTable {
    funcTab: FunctionTable;
    structTab: StructTable;
    typeTree: TypeTree;
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
                if (!typeEquals(s.current.variable.typeExpected, s.current.expression.returnType)) {
                    raise(ErrorIncorrectTypeGivenForVariable(s.current.variable, s.current.expression));
                }
            }
            s.current.variable.variable.isMutable = s.current.variable.isMutable;
            vartab = updateVariableTable(vartab, s.current.variable.variable);
            break;
        case "Variable":
            const matching = vartab[s.current.variable.repr];
            if (!matching.isMutable) {
                raise(ErrorAssigningToImmutableVariable(s.current.variable));
            }
            [s.current.expression, symbols] = fillUpExpressionTypeInfo(s.current.expression, symbols, vartab);
            if (!typeEquals(matching.returnType, s.current.expression.returnType)) {
                throw new Error(
`The data type of ${matching.repr} should be ${stringifyType(matching.returnType)}, ` +
`but you assigned it with ${stringifyType(s.current.expression.returnType)}`);
            } else {
                s.current.variable.returnType = matching.returnType;
            }
            break;
        }
        break;
    case "FunctionCall":
        [s.current, symbols.funcTab] = fillUpFunctionCallTypeInfo(s.current, symbols, vartab);
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

export function fillUpForStmtTypeInfo(f: ForStatement, symbols: SymbolTable, vartab: VariableTable):
    [ForStatement, SymbolTable, VariableTable] {
    [f.expression, symbols] = fillUpExpressionTypeInfo(f.expression, symbols, vartab);
    if (f.expression.returnType.kind === "CompoundType") {
        f.iterator.returnType = f.expression.returnType.of.current;
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
    case "List":     e = fillUpArrayTypeInfo   (e, symbols, vartab); break;
    case "Number":   e = fillUpSimpleTypeInfo  (e, "Number"); break;
    case "String":   e = fillUpSimpleTypeInfo  (e, "String"); break;
    case "Variable": e = fillUpVariableTypeInfo(e, vartab); break;
    case "ObjectExpression":
        if (e.constructor !== null) {
            e.returnType = getStruct(e.constructor, symbols.structTab);
            [e.keyValueList, symbols] = fillUpKeyValueListTypeInfo(e.keyValueList, symbols, vartab);
            checkIfKeyValueListConforms(e.keyValueList, e.returnType);
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

export function checkIfKeyValueListConforms(
    keyValues: LinkedNode<KeyValue>,
    structDecl: StructDeclaration
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
            if (!typeEquals(matchingMember.expectedType, kvs[i].expression.returnType)) {
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
    : [LinkedNode<KeyValue>, SymbolTable] {
    let current: LinkedNode<KeyValue> | null = k;
    while (current !== null) {
        [current.current.expression, symbols] = fillUpExpressionTypeInfo(current.current.expression, symbols, vartab);
        current = current.next;
    }
    return [k, symbols];
}

export function fillUpVariableTypeInfo(e: Variable, vtab: VariableTable): Variable {
    e.returnType = vtab[e.repr].returnType;
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
            raise(ErrorNoConformingFunction(f, matchingFunctions, CURRENT_SOURCE_CODE()));
        }
    } else {
        raise(ErrorUsingUnknownFunction(f));
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
        const [distance, error] = paramTypesConforms(currentFunc.parameters, matchingParams, typeTree);
        if (error !== null) {
            raise(ErrorNoConformingFunction(
                f,
                error.paramPosition,
                matchingParams[error.paramPosition],
                matchingFunctions.map((x) => x.parameters[error.paramPosition].typeExpected),
            ));
        } else if (distance < minimumDistance) {
            closestFunction = currentFunc;
            minimumDistance = distance;
        }
    }
    // more than 99 means no matching parent
    return closestFunction || null;
}

export function paramTypesConforms(
    expectedParams: VariableDeclaration[],
    actualParams: Expression[],
    typeTree: TypeTree
): [number, {paramPosition: number /*zero-based*/}|null] {
    let resultScore = 0;
    for (let i = 0; i < expectedParams.length; i++) {
        const expectedType = expectedParams[i].typeExpected;
        const actualType = actualParams[i].returnType;
        if (typeEquals(expectedType, actualType)) {
            resultScore += 0;
        } else {
            const score = childOf(actualType, expectedType, typeTree);
            if (score !== null) {
                resultScore += score;
            } else {
                 return [99, {
                    paramPosition: i
                }];
            }
        }
    }
    return [resultScore, null];
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
        case "GenericType":
            return matchingType;
            break;
        case "SimpleType":
            // do nothing
            break;
    }
    return dest;
}

export function fillUpArrayTypeInfo(e: ListExpression, symbols: SymbolTable, vartab: VariableTable): ListExpression {
    if (e.elements !== null) {
        [e.elements, symbols] = fillUpElementsType(e.elements, symbols, vartab);
        e.returnType = getElementsType(e.elements);
    } else {
        throw new Error("Don't know how to handle yet");
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

export function getElementsType(a: LinkedNode<Expression>): CompoundType {
    const types = flattenLinkedNode(a).map((x) => x.returnType);
    checkIfAllElementTypeAreHomogeneous(types);
    return {
        kind: "CompoundType",
        container: ListType(),
        of: singleLinkedNode(types[0]),
        nullable: false,
        location: NullTokenLocation()
    };
}

export function checkIfAllElementTypeAreHomogeneous(ts: TypeExpression[]): void {
    if (ts.some((x) => !typeEquals(x, ts[0]))) {
        throw new Error("Every element in an array should have the same type");
    }
    // TODO: Check if every element is of the same type
}

export function typeEquals(x: TypeExpression, y: TypeExpression): boolean {
    if (x.kind !== y.kind) {
        return false;
    } else {
        switch (x.kind) {
            case "SimpleType":
            case "EnumDeclaration":
            case "StructDeclaration":
                return x.name.repr === (y as SimpleType).name.repr;
            case "CompoundType":
                y = y as CompoundType;
                if (typeEquals(x.container, y.container)) {
                    return false;
                } else {
                    const xOfTypes = flattenLinkedNode(x.of);
                    const yOfTypes = flattenLinkedNode(y.of);
                    for (let i = 0; i < xOfTypes.length; i++) {
                        if (!typeEquals(xOfTypes[i], yOfTypes[i])) {
                            return false;
                        }
                    }
                    return true;
                }
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
