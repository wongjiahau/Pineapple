import {
    AtomicToken,
    BranchStatement,
    BuiltinType,
    BuiltinTypename,
    Declaration,
    EmptyList,
    EnumDeclaration,
    Expression,
    ForStatement,
    FunctionCall,
    FunctionDeclaration,
    GenericList,
    KeyValue,
    LinkedNode,
    ListExpression,
    MemberDefinition,
    newStringExpression,
    NumberExpression,
    ResolvedType,
    ReturnStatement,
    Statement,
    StringExpression,
    StringInterpolationExpression,
    StructDeclaration,
    StructType,
    TestExpression,
    TokenLocation,
    TupleExpression,
    TypeExpression,
    UnresolvedType,
    Variable,
    VariableDeclaration
} from "./ast";

import {ErrorAccessingInexistentMember} from "./errorType/E0001-AccessingInexistentMember";
import {ErrorAssigningToImmutableVariable} from "./errorType/E0002-AssigningToImmutableVariable";
import {ErrorDuplicatedMember} from "./errorType/E0003-DuplicatedMember";
import {ErrorExtraMember} from "./errorType/E0004-ExtraMember";
import {ErrorIncorrectTypeGivenForMember} from "./errorType/E0005-IncorrectTypeGivenForMember";
import {ErrorIncorrectTypeGivenForVariable} from "./errorType/E0006-IncorrectTypeGivenForVariable";
import {ErrorMissingMember} from "./errorType/E0007-ErrorMissingMember";
import {ErrorNoConformingFunction} from "./errorType/E0008-NoConformingFunction";
import {ErrorStructRedeclare} from "./errorType/E0009-StructRedeclare";
import { ErrorSyntax, ParserErrorDetail } from "./errorType/E0010-Syntax";
import {ErrorUnmatchingReturnType} from "./errorType/E0011-UnmatchingReturnType";
import { ErrorConditionIsNotBoolean } from "./errorType/E0012-ConditionIsNotBoolean";
import {ErrorUsingUnknownFunction} from "./errorType/E0013-UsingUnknownFunction";
import {ErrorVariableRedeclare} from "./errorType/E0014-VariableRedeclare";
import {ErrorEnumRedeclare} from "./errorType/E0015-EnumRedeclare";
import {ErrorNonVoidExprNotAssignedToVariable} from "./errorType/E0016-NonVoidExprNotAssignedToVariable";
import {ErrorUsingUndefinedVariable} from "./errorType/E0017-UsingUndefinedVariable";
import {ErrorAssigningToUndefinedVariable} from "./errorType/E0018-AssigningToUndefinedVariable";
import {ErrorForExprNotArray} from "./errorType/E0019-ForExprNotArray";
import {ErrorUsingUndefinedEnum} from "./errorType/E0020-UsingUndefinedEnum";
import {ErrorAssigningVoidToVariable} from "./errorType/E0021-AssigningVoidToVariable";
import {ErrorAssigningNullToUnnullableVariable} from "./errorType/E0022-AssigningNullToUnnullableVariable";
import {ErrorUsingUndefinedType} from "./errorType/E0023-UsingUndefinedType";
import {ErrorListElementsArentHomogeneous} from "./errorType/E0024-ListElementsArentHomogeneous";
import {ErrorUsingUndefinedGenericName} from "./errorType/E0025-UsingUndefinedGenericName";
import { ErrorInterpolatedExpressionIsNotString } from "./errorType/E0026-InperolatedExpressionIsNotString";
import { ErrorMissingClosingBracket } from "./errorType/E0027-MissingClosingBracket";
import {ErrorDetail, stringifyTypeReadable} from "./errorType/errorUtil";
import {renderError} from "./errorType/renderError";
import {convertToLinkedNode, flattenLinkedNode, isSyntaxError} from "./getIntermediateForm";
import {SourceCode} from "./interpreter";
import { prettyPrint } from "./pine2js";
import {stringifyFuncSignature} from "./transpile";
import {
    BaseStructType,
    childOf,
    Comparer,
    EnumType,
    findElement,
    insertChild,
    newBuiltinType,
    newListType,
    newStructType,
    newTupleType,
    Tree,
    VoidType
} from "./typeTree";
import {find} from "./util";

const parser     = require("../jison/pineapple-parser-v2");

let CURRENT_SOURCE_CODE: () => SourceCode;
export function fillUpTypeInformation(decls: Declaration[], sourceCode: SourceCode, symbols: SymbolTable): [Declaration[], SymbolTable] {

    CURRENT_SOURCE_CODE = () => sourceCode;
    // Complete the function and struct table This step is to allow programmer to
    // define function anywhere without needing to adhere to strict top-down or
    // bottom-up structure
    for (let i = 0; i < decls.length; i++) {
        const currentDecl = decls[i];
        currentDecl.originFile = CURRENT_SOURCE_CODE().filename;
        switch (currentDecl.kind) {
            case "FunctionDeclaration":
                for (let j = 0; j < currentDecl.parameters.length; j++) {
                    currentDecl.parameters[j].typeExpected = resolveType(currentDecl.parameters[j].typeExpected, symbols);
                }
                currentDecl.returnType = resolveType(currentDecl.returnType, symbols);
                symbols.funcTab = newFunctionTable(currentDecl, symbols.funcTab);
                break;
            case "StructDeclaration":
                // check if the struct is declared already or not
                newStructTab(currentDecl, copy(symbols.structTab));

                const tempSymbols = copy(symbols);
                tempSymbols.typeTree = insertChild<TypeExpression> (
                    newStructType(currentDecl, currentDecl.genericList),
                    BaseStructType(),
                    tempSymbols.typeTree,
                    typeEquals
                );

                const validatedStruct = validateStruct(currentDecl, tempSymbols);
                symbols.structTab = newStructTab(validatedStruct, symbols.structTab);
                symbols.typeTree = insertChild<TypeExpression> (
                    newStructType(validatedStruct, validatedStruct.genericList),
                    BaseStructType(),
                    symbols.typeTree,
                    typeEquals
                );
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
                const [statements,
                    newSymbols] = fillUp(currentDecl.statements, symbols, vartab);
                currentDecl.statements = statements;
                symbols = newSymbols;
                verifyFunctionDeclaration(currentDecl);
                break;
        }
    }
    return [decls, symbols];
}

export function validateStruct(s: StructDeclaration, symbols: SymbolTable): StructDeclaration {
    const generics = flattenLinkedNode(s.genericList).map((x) => x.name.repr);
    s.members = validateMembers(generics, s.members, symbols);
    return s;
}

function validateMembers(declaredGenerics: string[], memberList: LinkedNode < MemberDefinition > | null, symbols: SymbolTable): LinkedNode < MemberDefinition > | null {
    const members = flattenLinkedNode(memberList);
    for (let i = 0; i < members.length; i++) {
        const m = members[i];
        m.expectedType = resolveType(m.expectedType, symbols);
        switch (m.expectedType.kind) {
            case "GenericTypename":
                if (declaredGenerics.indexOf(m.expectedType.name.repr) < 0) {
                    raise(ErrorUsingUndefinedGenericName(m.expectedType.name, declaredGenerics));
                }
                break;

            case "BuiltinType":
            case "StructType":
                if (m.expectedType.genericList !== null) {
                    m.expectedType.genericList = resolveGenericsType(m.expectedType.genericList, symbols);
                    m.expectedType.genericList = validateGenericType(
                        declaredGenerics,
                        m.expectedType.genericList,
                        symbols
                    );
                }
                break;
        }
    }
    return convertToLinkedNode(members);
}

/**
 * This function is to check whether non-declared generic typename is used.
 */
export function validateGenericType(declaredGenerics: string[], g: GenericList, symbols: SymbolTable): GenericList {
    const gs = flattenLinkedNode(g);
    for (let i = 0; i < gs.length; i++) {
        let g = gs[i];
        if (g.kind === "GenericTypename") {
            if (declaredGenerics.indexOf(g.name.repr) < 0) {
                raise(ErrorUsingUndefinedGenericName(g.name, declaredGenerics));
            }
        } else {
            g = resolveType(g, symbols);
            switch (g.kind) {
                case "StructType":
                case "BuiltinType":
                    g.genericList = resolveGenericsType(g.genericList, symbols);
                    g.genericList = validateGenericType(declaredGenerics, g.genericList, symbols);
            }
        }
    }
    return g;
}

export function newEnumTab(e: EnumDeclaration, enumTab: EnumTable): EnumTable {
    if (enumTab[e.name.repr]) {
        raise(ErrorEnumRedeclare(e, enumTab[e.name.repr].originFile));
    } else {
        enumTab[e.name.repr] = e;
    }
    return enumTab;
}

export function findTableEntry < T >(table: TableOf < T >, key: string): T | null {
    const matchingKey = Object
        .keys(table)
        .filter((x) => x === key)[0];
    if (matchingKey) {
        return table[matchingKey];
    } else {
        return null;
    }
}

export function resolveType(t: TypeExpression | null, symbols: SymbolTable): TypeExpression {
    if (t === null) {
        return VoidType();
    } else if (t.kind in ["UnresolvedType", "GenericTypename"]) {
        throw new Error(`${stringifyTypeReadable(t)} had been resolved before`);
    }
    switch (t.kind) {
        case "UnresolvedType":
            // check type tree
            let result: TypeExpression;
            const matchingType = findElement(symbols.typeTree, t, comparerForUnresolvedType);
            if (matchingType) {
                result = copy(matchingType);
                result.nullable = t.nullable;
                if ("genericList" in result) {
                    result.genericList = t.genericList;
                    result.genericList = resolveGenericsType(result.genericList, symbols);
                }
                return result;
            } else {
                raise(ErrorUsingUndefinedType(t.name, symbols));
            }
            break;
        case "VoidType":
            return VoidType();
        case "GenericTypename":
        case "BuiltinType":
        case "StructType":
            return t;
        default:
            // search struct table
            throw new Error(`${t.kind} cant be resolved yet`); // TODO: implement it
    }

    function comparerForUnresolvedType(x: TypeExpression, y: TypeExpression): boolean {
        if (x.kind === "UnresolvedType" && y.kind === "UnresolvedType") {
            throw new Error("impossible");
        }
        if (x.kind !== "UnresolvedType" && y.kind !== "UnresolvedType") {
            throw new Error("impossible");
        }
        if (y.kind === "UnresolvedType") {
            // swap x with y
            [x, y] = [y, x];
        }
        x = x as UnresolvedType;
        const name = x.name.repr;
        switch (y.kind) {
            case "BuiltinType":
                return name === y.name;
            case "StructType":
                return name === y.reference.name.repr;
            case "EnumDeclaration":
                return name === y.name.repr;
            default:
                throw new Error(`Cannot handle ${y.kind} yet`);
        }
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

export function newFunctionTable(newFunc: FunctionDeclaration, previousFuncTab: FunctionTable, ): FunctionTable {
    const key = stringifyFuncSignature(newFunc.signature);
    if (newFunc.returnType === null) {
        newFunc.returnType = VoidType();
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
    const returnStatements = flattenLinkedNode(f.statements).filter((x) => x.kind === "ReturnStatement")as ReturnStatement[];
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
            if (stringifyTypeReadable(x.parameters[i].typeExpected) !== stringifyTypeReadable(y.parameters[i].typeExpected)) {
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
    typeTree: Tree < TypeExpression >;
    enumTab: EnumTable;
}

export interface TableOf < T > {
    [key: string]: T;
}

export type StructTable = TableOf < StructDeclaration >;
export type VariableTable = TableOf < Variable >;
export type FunctionTable = TableOf < FunctionDeclaration[] >;
export type EnumTable = TableOf < EnumDeclaration >;

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

export function fillUp(s: LinkedNode < Statement >, symbols: SymbolTable, vartab: VariableTable): [
    LinkedNode < Statement >,
    SymbolTable
] {
    switch (s.current.kind) {
        case "ReturnStatement":
            [s.current.expression, symbols] = fillUpExpressionTypeInfo(s.current.expression, symbols, vartab);
            break;
        case "AssignmentStatement":
            switch (s.current.variable.kind) {
                case "VariableDeclaration":
                    [s.current.expression, symbols] = fillUpExpressionTypeInfo(s.current.expression, symbols, vartab);
                    if (s.current.expression.returnType.kind === "VoidType") {
                        return raise(ErrorAssigningVoidToVariable(s.current.expression));
                    }

                    // if variable type is inferred (means no type annotation given)
                    if (s.current.variable.typeExpected === null) {
                        s.current.variable.typeExpected = s.current.expression.returnType;
                        s.current.variable.variable.returnType = s.current.expression.returnType;
                    } else {
                        // if the variable is statically-typed check if variable is nullable
                        if (isNil(s.current.expression.returnType) && s.current.variable.typeExpected.nullable === false) {
                            raise(ErrorAssigningNullToUnnullableVariable(s.current.variable, s.current.expression, ));
                        }
                        s.current.variable.typeExpected = resolveType(s.current.variable.typeExpected, symbols);
                        s.current.variable.variable.returnType = s.current.variable.typeExpected;
                        const exprType = s.current.expression.returnType;
                        const expectedType = s.current.variable.typeExpected;
                        if (!isSubtypeOf(exprType, expectedType, symbols.typeTree, typeEquals)) {
                            raise(ErrorIncorrectTypeGivenForVariable(s.current.variable.variable, s.current.variable.typeExpected, s.current.expression));
                        }
                    }

                    s.current.variable.variable.isMutable = s.current.variable.isMutable;
                    vartab = updateVariableTable(vartab, s.current.variable.variable);
                    break;
                case "Variable":
                    const matching = findVariable(s.current.variable, vartab, true);
                    if (!matching.isMutable) {
                        raise(ErrorAssigningToImmutableVariable(s.current.variable));
                    }[s.current.expression, symbols] = fillUpExpressionTypeInfo(s.current.expression, symbols, vartab);
                    if (!isSubtypeOf(s.current.expression.returnType, matching.returnType, symbols.typeTree, typeEquals)) {
                        raise(ErrorIncorrectTypeGivenForVariable(s.current.variable, matching.returnType, s.current.expression));
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

function findVariable(v: Variable, vartab: VariableTable, isAssignment: boolean): Variable {
    const matching = vartab[v.repr];
    if (matching === undefined) {
        if (isAssignment) {
            return raise(ErrorAssigningToUndefinedVariable(v));
        } else {
            return raise(ErrorUsingUndefinedVariable(v, vartab));
        }
    } else {
        return matching;
    }
}

export function fillUpForStmtTypeInfo(f: ForStatement, symbols: SymbolTable, vartab: VariableTable): [ForStatement, SymbolTable, VariableTable] {
    [f.expression, symbols] = fillUpExpressionTypeInfo(f.expression, symbols, vartab);
    const exprType = f.expression.returnType;
    if (exprType.kind === "BuiltinType" && exprType.name === "List") {
        if (exprType.genericList !== null) {
            f.iterator.returnType = exprType.genericList.current;
        } else {
            throw new Error("Something is wrong");
        }
        vartab = updateVariableTable(vartab, f.iterator);
    } else {
        raise(ErrorForExprNotArray(f.expression));
    }[f.body, symbols] = fillUp(f.body, symbols, vartab);
    return [f, symbols, vartab];
}

export function fillUpTestExprTypeInfo(t: TestExpression, symbols: SymbolTable, vartab: VariableTable): [TestExpression, SymbolTable] {
    [t.current, symbols] = fillUpExpressionTypeInfo(t.current, symbols, vartab);
    assertReturnTypeIsBoolean(t.current);
    let next = t.next;
    while (next !== null) {
        [next.current, symbols] = fillUpExpressionTypeInfo(next.current, symbols, vartab);
        assertReturnTypeIsBoolean(next.current);
        next = next.next;
    }
    return [t, symbols];
}

export function assertReturnTypeIsBoolean(e: Expression) {
    const type = e.returnType;
    if ((type.kind === "EnumDeclaration" && type.name.repr === "Boolean") ||
        (type.kind === "StructType" && type.reference.name.repr === "Boolean")) {
        // ok
    } else {
        raise(ErrorConditionIsNotBoolean(e));
    }
}

export function fillUpBranchTypeInfo(b: BranchStatement, symbols: SymbolTable, vartab: VariableTable): [BranchStatement, SymbolTable] {
    [b.body, symbols] = fillUp(b.body, symbols, vartab);
    if (b.test !== null) {
        [b.test, symbols] = fillUpTestExprTypeInfo(b.test, symbols, vartab);
    }
    if (b.elseBranch !== null) {
        [b.elseBranch, symbols] = fillUpBranchTypeInfo(b.elseBranch, symbols, vartab);
    }
    return [b, symbols];
}

export function fillUpExpressionTypeInfo(e: Expression, symbols: SymbolTable, vartab: VariableTable): [Expression, SymbolTable] {
    switch (e.kind) {
        case "FunctionCall":
            [e, symbols.funcTab] = fillUpFunctionCallTypeInfo(e, symbols, vartab);
            return [e, symbols];
        case "List":
            [e, symbols] = fillUpArrayTypeInfo(e, symbols, vartab);
            break;
        case "TupleExpression":
            [e, symbols] = fillUpTupleTypeInfo(e, symbols, vartab);
            break;
        case "Number":
            if (e.repr.indexOf(".") >= 0) {
                e = fillUpSimpleTypeInfo(e, "Number");
            } else {
                e = fillUpSimpleTypeInfo(e, "Integer");
            }
            break;
        case "String":
            e = fillUpSimpleTypeInfo(e, "String") as StringExpression;
            [e, symbols] = resolveExpressionInterpolation(e, symbols, vartab);
            break;
        case "Variable":
            e = fillUpVariableTypeInfo(e, vartab);
            break;
        case "ObjectExpression":
            if (e.constructor !== null) {
                e.constructor = resolveType(e.constructor, symbols);
                if (e.constructor.kind === "StructType") {
                    e.returnType = newStructType(e.constructor.reference, e.constructor.genericList);
                    [e.keyValueList, symbols] = fillUpKeyValueListTypeInfo(e.keyValueList, symbols, vartab);
                    checkIfKeyValueListConforms(
                        e.keyValueList,
                        substituteStructGeneric(e.constructor, e.constructor.reference),
                        symbols
                    );
                } else if (e.constructor.kind === "BuiltinType") {
                    if (e.constructor.name === "List") {
                        if (e.keyValueList === null) {
                            e = EmptyList(e.location, e.constructor);
                        } else {
                            throw new Error("List type shouldn't have key value");
                        }
                    }
                } else {
                    throw new Error(`${stringifyTypeReadable(e.constructor)} is neither struct nor builtin.`);
                }
            } else {
                e.returnType = newBuiltinType("Table");
            }
            break;
        case "ObjectAccess":
            [e.subject, symbols] = fillUpExpressionTypeInfo(e.subject, symbols, vartab);
            const subjectReturnType = e.subject.returnType;
            switch (subjectReturnType.kind) {
                case "StructType":
                    e.returnType = findMemberType(e.key, subjectReturnType.reference);
                    break;
                case "UnresolvedType":
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
            e.returnType = findMatchingEnumType(e.value, symbols.enumTab);
            break;
        default:
            throw new Error(`Unimplemented yet for ${e.kind}`);
    }
    return [e, symbols];
}

export function resolveExpressionInterpolation(
    s: StringExpression,
    symbols: SymbolTable,
    vartab: VariableTable
): [StringInterpolationExpression | StringExpression, SymbolTable] {
    const str = s.repr;

    if (str.indexOf("$(") < 0) {
        return [s, symbols];
    }

    const result: StringInterpolationExpression = {
        kind: "StringInterpolationExpression",
        returnType: newBuiltinType("String"),
        location: s.location,
        expressions: []
    };
    let current = "";
    let previousIndex = 0;
    let numberOfClosingBracketRequired = 0;
    let interpolationFound = false;
    let closingBracketFound = false;
    for (let i = 1; i < str.length; i++) {  // starts from 1 skip quotes
        const isOpeningBracket = str[i] === "$" && str[i + 1] === "(";
        const isAtLastPosition = i === str.length - 1;
        if (isAtLastPosition || isOpeningBracket) {
            const location = copy(s.location);
            location.last_column = s.location.first_column + i;
            location.first_column = previousIndex;
            result.expressions.push(newStringExpression(`"${current}"`, location));
            current = "";
            i++;
            previousIndex = i + 1;
            if (isOpeningBracket) {
                if (interpolationFound) {
                    const errorLocation = s.location;
                    errorLocation.first_column += i - 2;
                    errorLocation.last_column = errorLocation.first_column + 1;
                    raise(ErrorMissingClosingBracket(
                        s, 1 + numberOfClosingBracketRequired,
                        errorLocation
                    ));
                }
                interpolationFound = true;
                closingBracketFound = false;
            }
        } else if (str[i] === "(" && str[i - 1] !== "$") {
            if (interpolationFound) {
                numberOfClosingBracketRequired++;
                current += str[i];
            }
        } else if (str[i] === ")") {
            if (numberOfClosingBracketRequired > 0) {
                numberOfClosingBracketRequired --;
                current += str[i];
            } else {
                closingBracketFound = true;
                interpolationFound = false;
                const repr = pad(current, s.location.first_line - 1, s.location.first_column + previousIndex);
                let expr = parser.parse(repr + " @EOF") as Expression;
                [expr, symbols] = fillUpExpressionTypeInfo(expr, symbols, vartab);
                if (isStringType(expr.returnType)) {
                    result.expressions.push(expr);
                    current = "";
                } else {
                    raise(ErrorInterpolatedExpressionIsNotString(expr));
                }
            }
        } else {
            current += str[i];
        }
    }
    if (interpolationFound && !closingBracketFound) {
        raise(ErrorMissingClosingBracket(s, 1 + numberOfClosingBracketRequired));
    }
    return [result, symbols];
}

function pad(s: string, topPad: number, leftPad: number): string {
    let result = "";
    for (let i = 0; i < topPad; i++) {
        result += "\n";
    }
    for (let i = 0; i < leftPad; i++) {
        result += " ";
    }
    result += s;
    return result;
}

export function isStringType(r: TypeExpression): boolean {
    return r.kind === "BuiltinType" && r.name === "String";
}

export function extractGenericList(t: TypeExpression): GenericList {
    switch (t.kind) {
        case "BuiltinType":
        case "StructType":
            return t.genericList;
        default:
            return null;
    }
}

export function substituteStructGeneric(t: StructType, s: StructDeclaration): StructDeclaration {
    const instantiatedGenerics = flattenLinkedNode(t.genericList);
    const originalGenerics = flattenLinkedNode(s.genericList);
    const genericBinding: TableOf<TypeExpression> = {};
    for (let i = 0; i < originalGenerics.length; i++) {
        genericBinding[originalGenerics[i].name.repr] = instantiatedGenerics[i];
    }
    const members = flattenLinkedNode(copy(s.members));
    for (let i = 0; i < members.length; i++) {
        members[i].expectedType = substituteGeneric(members[i].expectedType, genericBinding);
    }
    const result = copy(s);
    result.members = convertToLinkedNode(members);
    return result;
}

export function fillUpTupleTypeInfo(t: TupleExpression, symbols: SymbolTable, vartab: VariableTable): [TupleExpression, SymbolTable] {
    [t.elements, symbols] = fillUpElementsType(t.elements, symbols, vartab);
    t.returnType = getTupleReturnType(t);
    return [t, symbols];
}

export function getTupleReturnType(t: TupleExpression): TypeExpression {
    const types = flattenLinkedNode(t.elements).map((x) => x.returnType);
    const result: TypeExpression[] = [];
    for (let i = 0; i < types.length; i++) {
        result.push(types[i]);
    }
    return newTupleType(convertToLinkedNode(result));
}

export function findMatchingEnumType(value: AtomicToken, enumTab: EnumTable): EnumDeclaration {
    const matchingEnum: EnumDeclaration[] = [];
    let allEnums: AtomicToken[] = [];
    for (const key in enumTab) {
        if (enumTab.hasOwnProperty(key)) {
            const e = enumTab[key];
            allEnums = allEnums.concat(flattenLinkedNode(e.enums));
            if (flattenLinkedNode(e.enums).some((x) => x.repr === value.repr)) {
                matchingEnum.push(e);
            }
        }
    }
    if (matchingEnum.length === 0) {
        return raise(ErrorUsingUndefinedEnum(value, allEnums));
    } else if (matchingEnum.length > 1) {
        throw new Error(`There are more than one enum that have the value of ${value}`);
    } else {
        return matchingEnum[0];
    }
}

/**
 * Check if x is subtype of y
 */
export function isSubtypeOf(x: TypeExpression, y: TypeExpression, tree: Tree < TypeExpression >, comparer: Comparer < TypeExpression >): boolean {
    if (x.nullable && y.kind === "EnumDeclaration" && y.name.repr === "Nil") {
        return true;
    } else if (y.nullable && x.kind === "EnumDeclaration" && x.name.repr === "Nil") {
        return true;
    } else {
        return typeEquals(x, y) || childOf(x, y, tree, comparer) !== null;
    }
}

export function checkIfKeyValueListConforms(
    keyValues: LinkedNode < KeyValue > | null,
    structDecl: StructDeclaration,
    symbols: SymbolTable
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
            if (!isSubtypeOf(exprType, expectedType, symbols.typeTree, typeEquals)) {
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
    const valuesSoFar: {
        [key: string]: AtomicToken
    } = {};
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

export function fillUpKeyValueListTypeInfo(k: LinkedNode < KeyValue > | null, symbols: SymbolTable, vartab: VariableTable): [
    LinkedNode < KeyValue > | null,
    SymbolTable
] {
    let current: LinkedNode < KeyValue > | null = k;
    while (current !== null) {
        [current.current.expression, symbols] = fillUpExpressionTypeInfo(current.current.expression, symbols, vartab);
        current = current.next;
    }
    return [k, symbols];
}

export function fillUpVariableTypeInfo(e: Variable, vartab: VariableTable): Variable {
    const matching = findVariable(e, vartab, false);
    e.returnType = matching.returnType;
    return e;
}

export type SimpleExpression = NumberExpression | StringExpression;

export function fillUpSimpleTypeInfo(e: SimpleExpression, name: BuiltinTypename): SimpleExpression {
    return {
        ...e,
        returnType: newBuiltinType(name)
    };
}

export function fillUpFunctionCallTypeInfo(e: FunctionCall, symbols: SymbolTable, vartab: VariableTable): [FunctionCall, FunctionTable] {
    for (let i = 0; i < e.parameters.length; i++) {
        [e.parameters[i], symbols] = fillUpExpressionTypeInfo(e.parameters[i], symbols, vartab);
    }
    return getFuncSignature(e, symbols.funcTab, symbols.typeTree);
}

export function getFuncSignature(f: FunctionCall, functab: FunctionTable, typetree: Tree < TypeExpression >): [FunctionCall, FunctionTable] {
    const key = stringifyFuncSignature(f.signature);
    if (key in functab) {
        const matchingFunctions = functab[key].filter((x) => x.parameters.length === f.parameters.length);
        const closestFunction = getClosestFunction(f, matchingFunctions, typetree);
        // This step is necessary to fix parent type E.g., changing (Number -> Number)
        // to (Any -> Number)
        for (let j = 0; j < f.parameters.length; j++) {
            f.parameters[j].returnType = closestFunction.parameters[j].typeExpected;
        }
        f.returnType = closestFunction.returnType;

        // this step is needed for generic substituted function
        functab = newFunctionTable(closestFunction, functab);

        return [f, functab];
    } else {
        return raise(ErrorUsingUnknownFunction(f));
    }
}

export function getClosestFunction(f: FunctionCall, matchingFunctions: FunctionDeclaration[], typeTree: Tree < TypeExpression >): FunctionDeclaration {
    const paramLength = f.parameters.length;
    // First, find function that have the exact type signature with the calling
    // signature
    for (let i = 0; i < matchingFunctions.length; i++) {
        const matchingFunc = matchingFunctions[i];
        let gotConflict = false;
        for (let j = 0; j < paramLength; j++) {
            if (!typeEquals(f.parameters[j].returnType, matchingFunc.parameters[j].typeExpected // Dont ignore generic
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
    const errors: Array < {
        paramPosition: number
    } > = [];
    const relatedFuncs: FunctionDeclaration[] = [];
    for (let i = 0; i < matchingFunctions.length; i++) {
        const currentFunc = copy(matchingFunctions[i]);
        const matchingParams = f.parameters;
        if (containsGeneric(currentFunc.parameters)) {
            const genericsBinding = extractGenericBinding(currentFunc.parameters, f.parameters);
            if (genericsBinding !== null) {
                for (let j = 0; j < currentFunc.parameters.length; j++) {
                    currentFunc.parameters[j].typeExpected = substituteGeneric(currentFunc.parameters[j].typeExpected, genericsBinding);
                }
                currentFunc.returnType = substituteGeneric(currentFunc.returnType, genericsBinding);
            }
        }
        const [distance,
            error] = paramTypesConforms(currentFunc.parameters, matchingParams, typeTree);
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
        const farthestMatchingParamPosition = errors.sort((x, y) => x.paramPosition - y.paramPosition)[0].paramPosition;
        return raise(ErrorNoConformingFunction(f, farthestMatchingParamPosition, f.parameters[farthestMatchingParamPosition], relatedFuncs.map((x) => x.parameters[farthestMatchingParamPosition].typeExpected)));
    } else {
        return closestFunction;
    }
}

export function extractGenericBinding(genericParams: VariableDeclaration[], actualParams: Expression[]): {
    [templateName: string]: TypeExpression
} | null {
    // reverse is needed, so that the the type of first param can override later
    // types
    const genericParamss = genericParams
        .slice()
        .reverse();
    const actualParamss = actualParams
        .slice()
        .reverse();
    let result: TableOf < TypeExpression > = {};
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

function extract(genericType: TypeExpression, actualType: TypeExpression): TableOf < TypeExpression > {
    let result: TableOf < TypeExpression > = {};
    switch (genericType.kind) {
        case "GenericTypename":
            result[genericType.name.repr] = actualType;
            break;
        case "BuiltinType":
        case "StructType":
            const generics = flattenLinkedNode(genericType.genericList);
            if (actualType.kind === "UnresolvedType") {
                throw new Error(`${actualType} is not resolved yet`);
            }
            if (actualType.kind === "StructType" || actualType.kind === "BuiltinType") {
                for (let j = 0; j < generics.length; j++) {
                    result = {
                        ...result,
                        ...extract(generics[j], flattenLinkedNode(actualType.genericList)[j])
                    };
                }
            }
            break;
        default: /*no substituion required*/
            break;
    }
    return result;
}

export function paramTypesConforms(expectedParams: VariableDeclaration[], actualParams: Expression[], typeTree: Tree < TypeExpression >): [
    number, {
        paramPosition: number/*zero-based*/
    } | null
] {
    let resultScore = 0;
    for (let i = 0; i < expectedParams.length; i++) {
        const expectedType = expectedParams[i].typeExpected;
        const actualType = actualParams[i].returnType;
        const score = childOf(actualType, expectedType, typeTree, typeEquals);
        if (score !== null) {
            resultScore += score;
        } else {
            return [
                99, {
                    paramPosition: i
                }
            ];
        }
    }
    return [resultScore, null];
}

function containsGeneric(params: VariableDeclaration[]): boolean {
    return params.some((x) => JSON.stringify(x).indexOf("GenericTypename") > -1);
}

function substituteGeneric(unsubstitutedType: TypeExpression, genericBinding: TableOf < TypeExpression >): TypeExpression {
    switch (unsubstitutedType.kind) {
        case "GenericTypename":
            return genericBinding[unsubstitutedType.name.repr];
        case "BuiltinType":
        case "StructType":
            const generics = flattenLinkedNode(unsubstitutedType.genericList);
            for (let i = 0; i < generics.length; i++) {
                generics[i] = substituteGeneric(generics[i], genericBinding);
            }
            unsubstitutedType.genericList = convertToLinkedNode(generics);
    }
    return unsubstitutedType;
}

export function fillUpArrayTypeInfo(e: ListExpression, symbols: SymbolTable, vartab: VariableTable): [ListExpression, SymbolTable] {
    if (e.elements !== null) {
        [e.elements, symbols] = fillUpElementsType(e.elements, symbols, vartab);
        e.returnType = getElementsType(e.elements);
    } else {
        throw new Error("impossible");
    }
    return [e, symbols];
}

export function fillUpElementsType(e: LinkedNode < Expression >, symbols: SymbolTable, vartab: VariableTable): [
    LinkedNode < Expression >,
    SymbolTable
] {
    let current: LinkedNode < Expression > | null = e;
    while (current !== null) {
        [current.current, symbols] = fillUpExpressionTypeInfo(current.current, symbols, vartab);
        current = current.next;
    }
    return [e, symbols];
}

export function getElementsType(elements: LinkedNode < Expression >): BuiltinType {
    checkIfAllElementTypeAreHomogeneous(flattenLinkedNode(elements));
    const types = flattenLinkedNode(elements).map((x) => x.returnType);
    return newListType(types[0])as BuiltinType;
}

export function checkIfAllElementTypeAreHomogeneous(ex: Expression[]): void {
    const typeOfFirstElement = ex[0].returnType;
    for (let i = 0; i < ex.length; i++) {
        if (!typeEquals(ex[i].returnType, typeOfFirstElement)) {
            raise(ErrorListElementsArentHomogeneous(ex[i], i, typeOfFirstElement));
        }
    }
}

export function genericsEqual(x: GenericList, y: GenericList): boolean {
    const genericsOfX = flattenLinkedNode(x);
    const genericsOfY = flattenLinkedNode(y);
    if (genericsOfX.length !== genericsOfY.length) {
        return false;
    }
    for (let i = 0; i < genericsOfX.length; i++) {
        if (!typeEquals(genericsOfX[i], genericsOfY[i])) { // TODO: should use subtype of
            return false;
        }
    }
    return true;
}

/**
 * This function is to make sure all the non-generictypename type
 *  declared within the generic bracket is defined.
 */
export function resolveGenericsType(genericList: GenericList, symbols: SymbolTable): GenericList {
    const gs = flattenLinkedNode(genericList);
    return convertToLinkedNode(gs.map((x) => resolveType(x, symbols)));
}

export function typeEquals(x: TypeExpression, y: TypeExpression): boolean {
    if (x.kind === "UnresolvedType") {
        throw new Error(`${stringifyTypeReadable(x)} at ${x.location} is not resolved yet.`);
    }
    if (y.kind === "UnresolvedType") {
        throw new Error(`${stringifyTypeReadable(y)} at ${y.location} is not resolved yet.`);
    }
    if (x.kind !== y.kind) {
        return false;
    } else {
        switch (x.kind) {
            case "EnumDeclaration":
                return x.name.repr === (y as EnumDeclaration).name.repr;
            case "BuiltinType":
                y = y as BuiltinType;
                return x.name === y.name && genericsEqual(x.genericList, y.genericList);
            case "StructType":
                y = y as StructType;
                return x.reference.name.repr === y.reference.name.repr && genericsEqual(x.genericList, y.genericList);
            case "GenericTypename":
                return true; // Is this correct?
            default:
                throw new Error(`Type comparison for ${x.kind} is not implemented yet`);
        }
    }
}

function copy < T >(x: T): T {
    return JSON.parse(JSON.stringify(x));
}

function isNil(t: TypeExpression): boolean {
    return t.kind === "EnumDeclaration" && t.name.repr === "Nil";
}

export type SourceCodeExtractor = (x: TokenLocation) => string;
