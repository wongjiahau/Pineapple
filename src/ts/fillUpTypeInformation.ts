import {
    AtomicToken,
    BranchStatement,
    BuiltinType,
    BuiltinTypename,
    EmptyList,
    EmptyTable,
    EnumDeclaration,
    Expression,
    ForStatement,
    FunctionCall,
    FunctionDeclaration,
    GenericList,
    KeyValue,
    ListExpression,
    MemberDefinition,
    newStringExpression,
    NumberExpression,
    ReturnStatement,
    Statement,
    StringExpression,
    StringInterpolationExpression,
    StructDeclaration,
    StructType,
    SyntaxTree,
    TokenLocation,
    TupleExpression,
    TypeExpression,
    UnresolvedType,
    Variable,
    VariableDeclaration,
    GroupDeclaration,
    Declaration,
    GroupBindingDeclaration
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
import {ErrorUnmatchingReturnType} from "./errorType/E0011-UnmatchingReturnType";
import {ErrorConditionIsNotBoolean } from "./errorType/E0012-ConditionIsNotBoolean";
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
import {ErrorInterpolatedExpressionIsNotString } from "./errorType/E0026-InperolatedExpressionIsNotString";
import {ErrorMissingClosingBracket } from "./errorType/E0027-MissingClosingBracket";
import {stringifyTypeReadable} from "./errorType/errorUtil";
import {ErrorDetail } from "./errorType/ErrorDetail";
import {SourceCode, InterpreterOptions } from "./interpret";
import {parseCode } from "./parseCodeToSyntaxTree";
import {getFullFunctionName, getPartialFunctionName, getName} from "./transpile";
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
    VoidType,
    logTree,
    findAllAncestorsOf
} from "./typeTree";
import {copy, find} from "./util";
import { Maybe, isOK, isFail, ok, fail } from "./maybeMonad";
import { ErrorUnimplementedFunction } from "./errorType/E0031-UnimplementedFunction";


let CURRENT_SOURCE_CODE: () => SourceCode;
export function fillUpTypeInformation(
    syntaxTree: SyntaxTree,
    symbols: SymbolTable,
    options: InterpreterOptions
): Maybe<[SyntaxTree, SymbolTable], ErrorDetail> {
    CURRENT_SOURCE_CODE = () => syntaxTree.source;
    // Complete the function and struct table This step is to allow programmer to
    // define function anywhere without needing to adhere to strict top-down or
    // bottom-up structure

    const decls = syntaxTree.declarations
        // Shift all GroupBindingDeclaration to the front
        .sort((x, y) =>  x.kind === "GroupBindingDeclaration" ? -1 : y.kind === "GroupBindingDeclaration" ? 1 : 0) 

        // Shift all StructDeclaration to the front
        .sort((x, y) =>  x.kind === "StructDeclaration" ? -1 : y.kind === "StructDeclaration" ? 1 : 0)

        // Shift all GroupDeclaration to the front
        .sort((x, y) =>  x.kind === "GroupDeclaration" ? -1 : y.kind === "GroupDeclaration" ? 1 : 0) 


        // Refer https://stackoverflow.com/questions/23921683/javascript-move-an-item-of-an-array-to-the-front

    for (let i = 0; i < decls.length; i++) {
        const d = decls[i];
        switch (d.kind) {
            case "FunctionDeclaration": {
                const result = fillUpFunctionDeclarationTypeInfo(d, symbols);
                if(isOK(result)) [decls[i], symbols] = result.value;
                else return result;

                const result1 = resolveGroupBinding(d, symbols);
                if(isOK(result1)) [decls[i], symbols] = result.value;
                else return result1;

                if(d.typeConstraint) {
                    throw new Error("Cannot handle yet");
                }
                break;
            }
            case "StructDeclaration":
                // check if the struct is declared already or not
                const tempStructTab  = newStructTab(d, copy(symbols.structTab));
                if (isFail(tempStructTab)) { return tempStructTab; }

                const tempSymbols = copy(symbols);
                tempSymbols.typeTree = insertChild<TypeExpression> (
                    newStructType(d, d.genericList),
                    BaseStructType(),
                    tempSymbols.typeTree,
                    typeEquals
                );

                const result = validateStruct(d, tempSymbols);
                if (isFail(result)) { return result; }
                const validatedStruct = result.value;

                const structTab = newStructTab(validatedStruct, symbols.structTab);
                if (isFail(structTab)) { return structTab; }

                symbols.structTab = structTab.value;

                symbols.typeTree = insertChild<TypeExpression> (
                    newStructType(validatedStruct, validatedStruct.genericList),
                    BaseStructType(),
                    symbols.typeTree,
                    typeEquals
                );
                break;
            case "EnumDeclaration":
                const result3 = newEnumTab(d, symbols.enumTab);
                if (result3.kind === "OK") {
                    symbols.enumTab = result3.value;
                    symbols.typeTree = insertChild(d, EnumType(), symbols.typeTree, typeEquals);
                } else {
                    return result3;
                }
                break;
            case "ExampleDeclaration":
                const result4 = fillUpStatementsTypeInfo(d.statements, symbols, {});
                if(isFail(result4)) return result4;
                else [d.statements, symbols] = result4.value;
                break;
            case "ImportDeclaration":
                break;
            case "GroupDeclaration": {
                // Insert the group type into type tree
                symbols.typeTree = insertChild(d, /*as child of*/ newBuiltinType("Any"), symbols.typeTree, typeEquals);

                // Extra handling is done at the last stage of analysis
                // So that any other problem is resolved first
                break;
            }
            case "GroupBindingDeclaration": {
                const childType = resolveType(d.childType, symbols);
                if(isOK(childType)) d.childType = childType.value;
                else return childType;

                const parentType = resolveType(d.parentType, symbols);
                if(isOK(parentType)) d.parentType = parentType.value;
                else return parentType;

                symbols.typeTree = insertChild(d.childType, d.parentType, symbols.typeTree, typeEquals);
                break;
            }
            default: 
                throw new Error(`Cannot handle ${d.kind} yet`)
        }
    }

    for (let i = 0; i < decls.length; i++) {
        const currentDecl = decls[i];
        switch (currentDecl.kind) {
            case "FunctionDeclaration":
                const vartab = getVariableTable(currentDecl.parameters);
                const result = fillUpStatementsTypeInfo(currentDecl.statements, symbols, vartab);
                if (result.kind === "Fail") { return result; } else {
                    const [statements, newSymbols] = result.value;
                    currentDecl.statements = statements;
                    if (!currentDecl.isAsync) {
                        currentDecl.isAsync = currentDecl.statements.some(isCallingAysncFunction);
                    }
                    symbols = newSymbols;
                    const verification = verifyFunctionDeclaration(currentDecl, symbols);
                    if (verification.kind === "Fail") { return verification; }
                }
                break;
        }
    }

    // Handle GroupDeclarations
    const gd = decls.filter((x) => x.kind === "GroupDeclaration") as GroupDeclaration[];
    for (let i = 0; i < gd.length; i++) {
        const result = fillUpGroupDeclarationTypeInfo(gd[i], decls, symbols);
        if(isOK(result)) [gd[i], symbols] = result.value;
        else return result;
    }

    return ok([syntaxTree, symbols] as [SyntaxTree, SymbolTable]);
}

export function fillUpGroupDeclarationTypeInfo(
    g: GroupDeclaration, 
    decls: Declaration[],
    symbols: SymbolTable
) : Maybe<[GroupDeclaration, SymbolTable], ErrorDetail> {

    g.bindingFunctions = [];

    const groupBindingDecls = decls.filter((x) => x.kind === "GroupBindingDeclaration") as GroupBindingDeclaration[]
    const bindingTypes = getBindingTypes(groupBindingDecls, g);

    const functionDecls = decls.filter((x) => x.kind === "FunctionDeclaration") as FunctionDeclaration[];
      
    const requiredFunctions = getRequiredFunctions(functionDecls, g, symbols.typeTree);

    if(requiredFunctions.length === 0) {
        // Then, no need to checking
        return ok([g, symbols] as [GroupDeclaration, SymbolTable]);
    }
    
    
    const allFunctions = decls.filter((x) => x.kind === "FunctionDeclaration") as FunctionDeclaration[];
    for (let i = 0; i < bindingTypes.length; i++) {
        const relatedFunctions = allFunctions
            .filter((x) => x.parameters.length > 0)
            .filter((x) => typeEquals(x.parameters[0].typeExpected, bindingTypes[i]))
            .sort(byFunctionName);
        
        if(relatedFunctions.length === 0) {
            return fail(ErrorUnimplementedFunction(requiredFunctions[0], bindingTypes[i], g))
        }
        
        // Search for the first relatedFunctions that matches the first requiredFunctions
        // So that the comparison can be done
        // Since both of them are sorted previously
        let found = false;
        for (let j = 0; j < relatedFunctions.length; j++) {
            if (getPartialFunctionName(relatedFunctions[j]) === getPartialFunctionName(requiredFunctions[0])) {
                // TODO: Also need to check if return type signature is matching
                found = true;
                
                // Start the comparison
                for (let k = 0; k < requiredFunctions.length && relatedFunctions.length; k++) {
                    // TODO: Generic pattern matching checking
                    if(getPartialFunctionName(relatedFunctions[k + j]) !== getPartialFunctionName(requiredFunctions[k])) {
                        return fail(ErrorUnimplementedFunction(requiredFunctions[k], bindingTypes[i], g))
                    } else {
                        g.bindingFunctions.push(relatedFunctions[k + j]);
                    }
                }
                break;
            }
        }
        if(!found) {
            return fail(ErrorUnimplementedFunction(requiredFunctions[0], bindingTypes[i], g));
        } 
    }
    
    return ok([g, symbols] as [GroupDeclaration, SymbolTable]);

}
function /*sort*/ byFunctionName(x: FunctionDeclaration, y: FunctionDeclaration): number {
    return getPartialFunctionName(x).localeCompare(getPartialFunctionName(y));
}

export function getRequiredFunctions(
    fs: FunctionDeclaration[], 
    g: GroupDeclaration,
    typeTree: Tree<TypeExpression>
)
: FunctionDeclaration[] {
    const allAncestors = 
        (findAllAncestorsOf(g, /*in*/ typeTree, typeEquals)
        .filter((x) => x.kind === "GroupDeclaration") as GroupDeclaration[])
        .concat([g]);
    
    return fs
        .filter((x) => x.groupBinding !== undefined)
        .filter((x) => {
            if(x.groupBinding) {
                return allAncestors.some(y => stringifyTypeReadable(x.groupBinding.typeBinded) === y.name.repr);
            } else {
                throw new Error("Impossible"); // this line is needed because TypeScript cannot handle such cases properly T.T
            }
        })
        .sort(byFunctionName);
}

export function getBindingTypes(originalGbs: GroupBindingDeclaration[], parentGroup: GroupDeclaration)
    : TypeExpression[] {
    let result: TypeExpression[] = [];
    const gbs = originalGbs.filter((x) => stringifyTypeReadable(x.parentType) === parentGroup.name.repr);

    for (let i = 0; i < gbs.length; i++) {
        const type = gbs[i].childType;
        if(type.kind === "GroupDeclaration") {
            // recursively look for binding child
            result = result.concat(getBindingTypes(originalGbs, type));
        } else {
            result.push(gbs[i].childType);
        }
    }

    return result;
}

export function resolveGroupBinding(d: FunctionDeclaration, symbols: SymbolTable)
: Maybe<[FunctionDeclaration, SymbolTable], ErrorDetail> {
    if(!d.groupBinding) {
        return ok([d, symbols] as [FunctionDeclaration, SymbolTable]);
    } else {
        const g = d.groupBinding;
        const resolveResult = resolveType(d.groupBinding.typeBinded, symbols);
        if(isFail(resolveResult)) {
            return resolveResult;
        } else {
            g.typeBinded = resolveResult.value;
            for (let i = 0; i < d.parameters.length; i++) {
                const x = d.parameters[i];
                const t = x.typeExpected;
                if(t.kind === "GenericTypename") {
                    if(g.genericList.some((y) => y.repr === t.name.repr)) {
                        x.typeExpected = g.typeBinded;
                    } else {
                        return fail(ErrorYetToBeDefined("Using undeclared generic name", t.location));
                    };
                } else {
                    // do nothing
                }
            }
        }
    }
    return ok([d, symbols] as [FunctionDeclaration, SymbolTable]);
}

export function fillUpFunctionDeclarationTypeInfo(d: FunctionDeclaration, symbols: SymbolTable)
: Maybe<[FunctionDeclaration, SymbolTable], ErrorDetail> {
    for (let j = 0; j < d.parameters.length; j++) {
        const result1 = resolveType(d.parameters[j].typeExpected, symbols);
        if (isOK(result1)) {
            d.parameters[j].typeExpected = result1.value;
        } else {
            return result1;
        }
    }
    const result2 = resolveType(d.returnType, symbols);
    if (result2.kind === "OK") { d.returnType = result2.value; } else { return result2; }

    const insertResult = newFunctionTable(d, symbols.funcTab);
    if(isOK(insertResult)) symbols.funcTab = insertResult.value; else return insertResult;

    return ok([d, symbols] as [FunctionDeclaration, SymbolTable]);
}

export function isCallingAysncFunction(s: Statement | null): boolean {
    if (s === null) {
        return false;
    }
    switch (s.kind) {
        case "AssignmentStatement":
            return containsAsyncFunction(s.expression);
        case "BranchStatement":
            return containsAsyncFunction(s.test) ||
                s.body.some(isCallingAysncFunction) ||
                isCallingAysncFunction(s.elseBranch);
        case "ForStatement":
            return containsAsyncFunction(s.expression) ||
                s.body.some(isCallingAysncFunction);
        case "WhileStatement":
            return containsAsyncFunction(s.test) ||
                s.body.some(isCallingAysncFunction);
        case "ReturnStatement":
            return containsAsyncFunction(s.expression);
        case "FunctionCall":
            return s.isAsync;
        default:
            return false;
    }
}

export function containsAsyncFunction(e: Expression | null): boolean {
    if (e === null) {
        return false;
    }
    switch (e.kind) {
        case "FunctionCall":
            if (e.isAsync) {
                return true;
            } else {
                return e.parameters.some(containsAsyncFunction);
            }
        case "List":
            return e.elements.some(containsAsyncFunction);
        case "ObjectExpression":
            return e.keyValueList.some((x) => containsAsyncFunction(x.expression));
        default: // TODO: Add code handler for other types of expression
            return false;
    }
}

export function validateStruct(s: StructDeclaration, symbols: SymbolTable)
: Maybe<StructDeclaration, ErrorDetail> {
    const generics = s.genericList.map((x) => x.name.repr);
    const result = validateMembers(generics, s.members, symbols);
    if (result.kind === "OK") {
        s.members = result.value;
    } else {
        return result;
    }
    return ok(s);
}

function validateMembers(
    declaredGenerics: string[],
    members: MemberDefinition[],
    symbols: SymbolTable
): Maybe<MemberDefinition[], ErrorDetail> {
    for (let i = 0; i < members.length; i++) {
        const m = members[i];
        const result = resolveType(m.expectedType, symbols);
        if (result.kind === "OK") { m.expectedType = result.value; } else { return result; }
        switch (m.expectedType.kind) {
            case "GenericTypename":
                if (declaredGenerics.indexOf(m.expectedType.name.repr) < 0) {
                    return fail(ErrorUsingUndefinedGenericName(m.expectedType.name, declaredGenerics));
                }
                break;
            case "BuiltinType":
            case "StructType":
                if (m.expectedType.genericList !== null) {
                    const result1 = resolveGenericsType(m.expectedType.genericList, symbols);
                    if (result1.kind === "OK") { m.expectedType.genericList = result1.value; } else { return result1; }

                    const result2 = validateGenericType(
                        declaredGenerics,
                        m.expectedType.genericList,
                        symbols
                    );

                    if (result2.kind === "OK") { m.expectedType.genericList = result2.value; } else { return result2; }
                }
                break;
        }
    }
    return ok(members);
}

/**
 * This function is to check whether non-declared generic typename is used.
 */
export function validateGenericType(declaredGenerics: string[], gs: GenericList, symbols: SymbolTable)
: Maybe<GenericList, ErrorDetail> {
    for (let i = 0; i < gs.length; i++) {
        let g = gs[i];
        if (g.kind === "GenericTypename") {
            if (declaredGenerics.indexOf(g.name.repr) < 0) {
                return fail(ErrorUsingUndefinedGenericName(g.name, declaredGenerics));
            }
        } else {
            const result1 = resolveType(g, symbols);
            if (result1.kind === "OK") { g = result1.value; } else { return result1; }
            switch (g.kind) {
                case "StructType":
                case "BuiltinType":
                    const result2 = resolveGenericsType(g.genericList, symbols);
                    if (result2.kind === "OK") { g.genericList = result2.value; } else { return result2; }

                    const result3 = validateGenericType(declaredGenerics, g.genericList, symbols);
                    if (result3.kind === "OK") { g.genericList = result3.value; } else { return result3; }
            }
        }
    }
    return ok(gs);
}

export function newEnumTab(e: EnumDeclaration, enumTab: EnumTable)
: Maybe<EnumTable, ErrorDetail> {
    if (enumTab[e.name.repr]) {
        return fail(ErrorEnumRedeclare(e, enumTab[e.name.repr].originFile));
    } else {
        enumTab[e.name.repr] = e;
    }
    return ok(enumTab);
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

export function resolveType(t: TypeExpression | null, symbols: SymbolTable)
: Maybe<TypeExpression, ErrorDetail> {
    if (t === null) {
        return ok(VoidType());
    } else if (t.kind in ["UnresolvedType", "GenericTypename"]) {
        throw new Error(`${stringifyTypeReadable(t)} had been resolved before`);
    }
    switch (t.kind) {
        case "UnresolvedType":
            // check type tree
            let type: TypeExpression;
            const matchingType = findElement(symbols.typeTree, t, comparerForUnresolvedType);
            if (matchingType) {
                type = copy(matchingType);
                type.nullable = t.nullable;
                if ("genericList" in type) {
                    type.genericList = t.genericList;
                    const result = resolveGenericsType(type.genericList, symbols);
                    if (result.kind === "OK") { type.genericList = result.value; } else { return result; }
                }
                return ok(type);
            } else {
                return fail(ErrorUsingUndefinedType(t.name, symbols));
            }
            break;
        case "VoidType":
            return ok(VoidType());
        case "GenericTypename":
        case "BuiltinType":
        case "StructType":
            return ok(t);
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
            case "GroupDeclaration":
                return name === y.name.repr;
            default:
                throw new Error(`Cannot handle ${y.kind} yet`);
        }
    }
}

export function newStructTab(s: StructDeclaration, structTab: StructTable)
: Maybe<StructTable , ErrorDetail> {
    if (s.name.repr in structTab) {
        return fail(ErrorStructRedeclare(s));
    } else {
        structTab[s.name.repr] = s;
    }
    return ok(structTab);
}

export function getFunctionSignature(f: FunctionDeclaration | FunctionCall): string {
    return f.signature.map((x) => x.repr).join("_");
}

export function newFunctionTable(newFunc: FunctionDeclaration, previousFuncTab: FunctionTable, )
: Maybe<FunctionTable, ErrorDetail> {
    const key = getFunctionSignature(newFunc);
    if (newFunc.returnType === null) {
        newFunc.returnType = VoidType();
    }
    if (!previousFuncTab[key]) {
        previousFuncTab[key] = [];
    }
    if (previousFuncTab[key].some((x) => functionEqual(x, newFunc))) {
        return fail(ErrorYetToBeDefined("Function duplicated", newFunc.signature[0].location))
    } else {
        previousFuncTab[key].push(newFunc);
    }
    return ok(previousFuncTab);
}

export function verifyFunctionDeclaration(f: FunctionDeclaration, symbols: SymbolTable)
: Maybe<null, ErrorDetail> {
    // Check if return statements are correct
    const returnStatements = f.statements
        .filter((x) => x.kind === "ReturnStatement") as ReturnStatement[];

    for (let i = 0; i < returnStatements.length; i++) {
        const r = returnStatements[i];
        if(f.returnType !== null) {
            if(!isSubtypeOf(r.expression.returnType, f.returnType, symbols.typeTree)) {
                return fail(ErrorUnmatchingReturnType(r, f.returnType));
            }
        }
    }
    return ok(null);
}

export function functionEqual(x: FunctionDeclaration, y: FunctionDeclaration): boolean {
    if (getFullFunctionName(x) !== getFullFunctionName(y)) {
        return false;
    } else if (x.parameters.length !== y.parameters.length) {
        return false;
    } else {
        for (let i = 0; i < x.parameters.length; i++) {
            if (stringifyTypeReadable(x.parameters[i].typeExpected)
            !== stringifyTypeReadable(y.parameters[i].typeExpected)) {
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

function updateVariableTable(vtab: VariableTable, variable: Variable)
: Maybe<VariableTable, ErrorDetail> {
    const initialVariable = vtab[variable.repr];
    if (initialVariable !== undefined) {
        return fail(ErrorVariableRedeclare(initialVariable, variable));
    }
    vtab[variable.repr] = variable;
    return ok(vtab);
}


export function fillUpStatementsTypeInfo(statements: Statement[], symbols: SymbolTable, vartab: VariableTable)
: Maybe<[Statement[], SymbolTable], ErrorDetail> {
    for (let i = 0; i < statements.length; i++) {
        const s = statements[i];
        switch (s.kind) {
        case "ReturnStatement":
            const result = fillUpExpressionTypeInfo(s.expression, symbols, vartab);
            if (result.kind === "OK") { [s.expression, symbols] = result.value; } else { return result; }
            break;
        case "AssignmentStatement":
            switch (s.variable.kind) {
                case "VariableDeclaration":
                    const resultVD = fillUpExpressionTypeInfo(s.expression, symbols, vartab);
                    if (resultVD.kind === "OK") { [s.expression, symbols] = resultVD.value; } else { return resultVD; }
                    if (s.expression.returnType.kind === "VoidType") {
                        return fail(ErrorAssigningVoidToVariable(s.expression));
                    }

                    // if variable type is inferred (means no type annotation given)
                    if (s.variable.typeExpected === null) {
                        s.variable.typeExpected = s.expression.returnType;
                        s.variable.variable.returnType = s.expression.returnType;
                    } else {
                        // if the variable is statically-typed check if variable is nullable
                        if (isNil(s.expression.returnType) && s.variable.typeExpected.nullable === false) {
                            return fail(ErrorAssigningNullToUnnullableVariable(s.variable, s.expression, ));
                        }
                        const resultType = resolveType(s.variable.typeExpected, symbols);
                        if (isOK(resultType)) {
                            s.variable.typeExpected = resultType.value;
                        } else {
                            return resultType;
                        }

                        s.variable.variable.returnType = s.variable.typeExpected;
                        const exprType = s.expression.returnType;
                        const expectedType = s.variable.typeExpected;
                        if (!isSubtypeOf(exprType, expectedType, symbols.typeTree)) {
                            return fail(ErrorIncorrectTypeGivenForVariable(
                                s.variable.variable, s.variable.typeExpected, s.expression));
                        }
                    }

                    s.variable.variable.isMutable = s.variable.isMutable;
                    const result3 = updateVariableTable(vartab, s.variable.variable);
                    if (result3.kind === "OK") { vartab = result3.value; } else { return result3; }
                    break;
                case "Variable":
                    const result2 = findVariable(s.variable, vartab, true);
                    if (result2.kind === "Fail") {
                        return result2;
                    } else {
                        const matching = result2.value;
                        if (!matching.isMutable) {
                            return fail(ErrorAssigningToImmutableVariable(s.variable));
                        }
                        const resultType = fillUpExpressionTypeInfo(s.expression, symbols, vartab);
                        if (resultType.kind === "OK") { [s.expression, symbols] = resultType.value;
                        } else { return resultType; }

                        if (!isSubtypeOf(s.expression.returnType, matching.returnType, symbols.typeTree)) {
                            return fail(ErrorIncorrectTypeGivenForVariable(
                                s.variable, matching.returnType, s.expression));
                        } else {
                            s.variable.returnType = matching.returnType;
                        }
                    }
                    break;
            }
            break;
        case "FunctionCall":
            const resultFC = fillUpFunctionCallTypeInfo(s, symbols, vartab);
            if (isOK(resultFC)) { [statements[i], symbols.funcTab] = resultFC.value; } else { return resultFC; }
            if (s.returnType.kind !== "VoidType") {
                return fail(ErrorNonVoidExprNotAssignedToVariable(s));
            }
            break;
        case "BranchStatement":
            const resultBS = fillUpBranchTypeInfo(s, symbols, vartab);
            if (isOK(resultBS)) { [statements[i], symbols] = resultBS.value; } else { return resultBS; }
            break;
        case "ForStatement":
            const resultFS = fillUpForStmtTypeInfo(s, symbols, vartab);
            if (isOK(resultFS)) { [statements[i], symbols, vartab] = resultFS.value; } else { return resultFS; }
            break;
        case "WhileStatement": {
            const resultWS1 = fillUpTestExprTypeInfo(s.test, symbols, vartab);
            if (isOK(resultWS1)) { [s.test, symbols] = resultWS1.value; } else { return resultWS1; }

            const resultWS2 = fillUpStatementsTypeInfo(s.body, symbols, vartab);
            if (isOK(resultWS2)) { [s.body, symbols] = resultWS2.value; } else { return resultWS2; }
            break;
        }
        case "PassStatement":
            s.callingFile = CURRENT_SOURCE_CODE().filename;
            break;
        case "JavascriptCode":
            // do nothing
            break;
        case "EnsureStatement":
            s.callingFile = CURRENT_SOURCE_CODE().filename;
            const resultAS = fillUpExpressionTypeInfo(s.expression, symbols, vartab);
            if(isOK(resultAS)) { [s.expression, symbols] = resultAS.value} else { return resultAS; }
            break;
        case "ExampleStatement":
            s.originFile = CURRENT_SOURCE_CODE().filename;
            const resultLeft = fillUpExpressionTypeInfo(s.left, symbols, vartab);
            if(isOK(resultLeft)) [s.left , symbols] = resultLeft.value; else return resultLeft;
            const resultRight = fillUpExpressionTypeInfo(s.right, symbols, vartab);
            if(isOK(resultRight)) [s.right , symbols] = resultRight.value; else return resultRight;
            if(!typeEquals(s.left.returnType, s.right.returnType)) {
                return fail(ErrorYetToBeDefined("Return type of left and right should be equal", s.location));
            }
            break;
        default: 
            throw new Error(`Cannot handle ${s.kind} yet`)
    }}
    return ok([statements, symbols] as [Statement[], SymbolTable]);
}

export function ErrorYetToBeDefined(message: string, location: TokenLocation): ErrorDetail {
    return {
        code: "XXX",
        name: "Error",
        message: message,
        relatedLocation: location
    };
}

function findVariable(v: Variable, vartab: VariableTable, isAssignment: boolean)
: Maybe<Variable, ErrorDetail> {
    const matching = vartab[v.repr];
    if (matching === undefined) {
        if (isAssignment) {
            return fail(ErrorAssigningToUndefinedVariable(v));
        } else {
            return fail(ErrorUsingUndefinedVariable(v, vartab));
        }
    } else {
        return ok(matching);
    }
}

export function fillUpForStmtTypeInfo(f: ForStatement, symbols: SymbolTable, vartab: VariableTable)
: Maybe<[ForStatement, SymbolTable, VariableTable], ErrorDetail> {
    const result = fillUpExpressionTypeInfo(f.expression, symbols, vartab);
    if (result.kind === "OK") { [f.expression, symbols] = result.value; } else { return result; }
    const exprType = f.expression.returnType;
    if (exprType.kind === "BuiltinType" && exprType.name === "List") {
        if (exprType.genericList !== null) {
            if (exprType.genericList.length > 1) {
                throw new Error();
            }
            f.iterator.returnType = exprType.genericList[0];
        } else {
            throw new Error("Something is wrong");
        }
        const updateResult = updateVariableTable(vartab, f.iterator);
        if (updateResult.kind === "OK") { vartab = updateResult.value; } else { return updateResult; }
    } else {
        return fail(ErrorForExprNotArray(f.expression));
    }
    const result2 = fillUpStatementsTypeInfo(f.body, symbols, vartab);
    if (result2.kind === "OK") {  [f.body, symbols] = result2.value; } else { return result2; }
    return ok([f, symbols, vartab] as [ForStatement, SymbolTable, VariableTable]);
}

export function fillUpTestExprTypeInfo(t: Expression, symbols: SymbolTable, vartab: VariableTable)
: Maybe<[Expression, SymbolTable], ErrorDetail> {
    const result = fillUpExpressionTypeInfo(t, symbols, vartab);
    if (result.kind === "OK") { [t, symbols] = result.value; } else { return result; }

    const result2 = assertReturnTypeIsBoolean(t);
    if (result2.kind === "Fail") { return result2; }

    return ok([t, symbols] as [Expression, SymbolTable]);
}

export function assertReturnTypeIsBoolean(e: Expression): Maybe<boolean, ErrorDetail> {
    const type = e.returnType;
    if ((type.kind === "EnumDeclaration" && type.name.repr === "Boolean") ||
        (type.kind === "StructType" && type.reference.name.repr === "Boolean")) {
        return ok(true);
    } else {
        return fail(ErrorConditionIsNotBoolean(e));
    }
}

export function fillUpBranchTypeInfo(b: BranchStatement, symbols: SymbolTable, vartab: VariableTable)
: Maybe<[BranchStatement, SymbolTable], ErrorDetail> {
    const result = fillUpStatementsTypeInfo(b.body, symbols, vartab);
    if (result.kind === "OK") { [b.body, symbols] = result.value; } else { return result; }
    if (b.test !== null) {
        const result2 = fillUpTestExprTypeInfo(b.test, symbols, vartab);
        if (result2.kind === "OK") { [b.test, symbols] = result2.value; } else { return result2; }
    }
    if (b.elseBranch !== null) {
        const result3 = fillUpBranchTypeInfo(b.elseBranch, symbols, vartab);
        if (result3.kind === "OK") { [b.elseBranch, symbols] = result3.value; } else { return result3; }
    }
    return ok([b, symbols] as [BranchStatement, SymbolTable]);
}

export function fillUpExpressionTypeInfo(e: Expression, symbols: SymbolTable, vartab: VariableTable)
: Maybe<[Expression, SymbolTable], ErrorDetail> {
    switch (e.kind) {
        case "FunctionCall":
            const result = fillUpFunctionCallTypeInfo(e, symbols, vartab);
            if (result.kind === "OK") { [e, symbols.funcTab] = result.value; } else { return result; }
            return ok([e, symbols] as [Expression, SymbolTable]);
        case "List":
            const resultList =  fillUpArrayTypeInfo(e, symbols, vartab);
            if (isOK(resultList)) { [e, symbols] = resultList.value; } else { return resultList; }
            break;
        case "TupleExpression":
            const resultTuple = fillUpTupleTypeInfo(e, symbols, vartab);
            if (isOK(resultTuple)) { [e, symbols] = resultTuple.value; } else { return resultTuple; }
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
            const resultStr = resolveExpressionInterpolation(e, symbols, vartab);
            if (isOK(resultStr)) { [e, symbols] = resultStr.value; } else { return resultStr; }
            break;
        case "Variable":
            const resultVar = fillUpVariableTypeInfo(e, vartab);
            if (isOK(resultVar)) { e = resultVar.value; } else { return resultVar; }
            break;
        case "ObjectExpression":
            if (e.constructor !== null) {
                const typeResult = resolveType(e.constructor, symbols);
                if (typeResult.kind === "OK") { e.constructor = typeResult.value; } else { return typeResult; }
                if (e.constructor.kind === "StructType") {
                    e.returnType = newStructType(e.constructor.reference, e.constructor.genericList);
                    const resultKV = fillUpKeyValueListTypeInfo(e.keyValueList, symbols, vartab);
                    if (isOK(resultKV)) { [e.keyValueList, symbols] = resultKV.value; } else { return resultKV; }

                    const x = checkIfKeyValueListConforms(
                        e.keyValueList,
                        substituteStructGeneric(e.constructor, e.constructor.reference),
                        symbols
                    );
                    if (!isOK(x)) { return x; }
                } else if (e.constructor.kind === "BuiltinType") {
                    if (e.keyValueList.length > 0) {
                        throw new Error("List type shouldn't have key value");
                    }
                    if (e.constructor.name === "List") {
                        e = EmptyList(e.location, e.constructor);
                    } else if (e.constructor.name === "Table") {
                        e = EmptyTable(e.location, e.constructor);
                    } else {
                        throw new Error(`Cannot handle ${e.constructor.name} yet`);
                    }
                } else {
                    throw new Error(`${stringifyTypeReadable(e.constructor)} is neither struct nor builtin.`);
                }
            } else {
                e.returnType = newBuiltinType("Table");
            }
            break;
        case "ObjectAccess":
            const resultOA = fillUpExpressionTypeInfo(e.subject, symbols, vartab);
            if (resultOA.kind === "OK") { [e.subject, symbols] = resultOA.value; } else { return resultOA; }
            const subjectReturnType = e.subject.returnType;
            switch (subjectReturnType.kind) {
                case "StructType":
                    const resultST = findMemberType(e.key, subjectReturnType.reference);
                    if (isOK(resultST)) { e.returnType = resultST.value; } else { return resultST; }
                    break;
                default:
                    throw new Error("Must be dictionary type of object type");
            }
            break;
        case "EnumExpression":
            const resultEnum = findMatchingEnumType(e.value, symbols.enumTab);
            if (isOK(resultEnum)) { e.returnType = resultEnum.value; } else { return resultEnum; }
            break;
        default:
            throw new Error(`Unimplemented yet for ${e.kind}`);
    }
    return ok([e, symbols] as [Expression, SymbolTable]);
}

export function resolveExpressionInterpolation(
    s: StringExpression,
    symbols: SymbolTable,
    vartab: VariableTable
): Maybe<[StringInterpolationExpression | StringExpression, SymbolTable], ErrorDetail> {
    const str = s.repr;
    if (str.indexOf("$(") < 0) {
        return ok([s, symbols] as [StringExpression, SymbolTable]);
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
                    return fail(ErrorMissingClosingBracket(
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
                const parseResult = parseCode({content: repr + " @EOF", filename: ""}, CURRENT_SOURCE_CODE());
                if (!isOK(parseResult)) {
                    return parseResult;
                }
                let expr = parseResult.value as Expression;
                const type = fillUpExpressionTypeInfo(expr, symbols, vartab);
                if (isOK(type)) {  [expr, symbols] = type.value; } else { return type; }
                if (isStringType(expr.returnType)) {
                    result.expressions.push(expr);
                    current = "";
                } else {
                    return fail(ErrorInterpolatedExpressionIsNotString(expr));
                }
            }
        } else {
            current += str[i];
        }
    }
    if (interpolationFound && !closingBracketFound) {
        return fail(ErrorMissingClosingBracket(s, 1 + numberOfClosingBracketRequired));
    }
    return ok([result, symbols] as [StringInterpolationExpression, SymbolTable]);
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
            return [];
    }
}

export function substituteStructGeneric(t: StructType, s: StructDeclaration): StructDeclaration {
    const instantiatedGenerics = t.genericList;
    const originalGenerics = s.genericList;
    const genericBinding: TableOf<TypeExpression> = {};
    for (let i = 0; i < originalGenerics.length; i++) {
        genericBinding[originalGenerics[i].name.repr] = instantiatedGenerics[i];
    }
    const members = copy(s.members);
    for (let i = 0; i < members.length; i++) {
        members[i].expectedType = substituteGeneric(members[i].expectedType, genericBinding);
    }
    const result = copy(s);
    result.members = members;
    return result;
}

export function fillUpTupleTypeInfo(t: TupleExpression, symbols: SymbolTable, vartab: VariableTable)
: Maybe<[TupleExpression, SymbolTable], ErrorDetail> {
    const result = fillUpElementsType(t.elements, symbols, vartab);
    if (isOK(result)) { [t.elements, symbols] = result.value; } else { return result; }
    t.returnType = getTupleReturnType(t);
    return ok([t, symbols] as [TupleExpression, SymbolTable]);
}

export function getTupleReturnType(t: TupleExpression): TypeExpression {
    const types = t.elements.map((x) => x.returnType);
    const result: TypeExpression[] = [];
    for (let i = 0; i < types.length; i++) {
        result.push(types[i]);
    }
    return newTupleType(result);
}

export function findMatchingEnumType(value: AtomicToken, enumTab: EnumTable)
: Maybe<EnumDeclaration, ErrorDetail> {
    const matchingEnum: EnumDeclaration[] = [];
    let allEnums: AtomicToken[] = [];
    for (const key in enumTab) {
        if (enumTab.hasOwnProperty(key)) {
            const e = enumTab[key];
            allEnums = allEnums.concat(e.enums);
            if (e.enums.some((x) => x.repr === value.repr)) {
                matchingEnum.push(e);
            }
        }
    }
    if (matchingEnum.length === 0) {
        return fail(ErrorUsingUndefinedEnum(value, allEnums));
    } else if (matchingEnum.length > 1) {
        throw new Error(`There are more than one enum that have the value of ${value}`);
    } else {
        return ok(matchingEnum[0]);
    }
}

/**
 * Check if x is subtype of y
 */
export function isSubtypeOf(
    x: TypeExpression,
    y: TypeExpression,
    tree: Tree < TypeExpression >,
): boolean {
    if (x.nullable && y.kind === "EnumDeclaration" && y.name.repr === "Nil") {
        return true;
    } else if (y.nullable && x.kind === "EnumDeclaration" && x.name.repr === "Nil") {
        return true;
    } else {
        return typeEquals(x, y) || childOf(x, y, tree, typeEquals) !== null;
    }
}

export function checkIfKeyValueListConforms(
    keyValues: KeyValue[],
    structDecl: StructDeclaration,
    symbols: SymbolTable
): Maybe<boolean, ErrorDetail> {
    const kvs = keyValues;
    const members = structDecl.members;

    // Check if every declared member is in member definitions
    for (let i = 0; i < kvs.length; i++) {
        const matchingMember = find(kvs[i], members, (k, m) => k.memberName.repr === m.name.repr);
        if (matchingMember === null) {
            return fail(ErrorExtraMember(kvs[i].memberName, structDecl));
        } else {
            // Check if type are equals to expected
            const exprType = kvs[i].expression.returnType;
            const expectedType = matchingMember.expectedType;
            if (!isSubtypeOf(exprType, expectedType, symbols.typeTree)) {
                return fail(ErrorIncorrectTypeGivenForMember(matchingMember.expectedType, kvs[i]));
            }
        }
    }

    // Check if every member definition is present in declared member
    for (let i = 0; i < members.length; i++) {
        if (!find(members[i], kvs, (m, k) => m.name.repr === k.memberName.repr)) {
            return fail(ErrorMissingMember(members[i].name.repr, structDecl, kvs[0].memberName.location));
        }
    }

    // Check if there are duplicated members
    const valuesSoFar: {
        [key: string]: AtomicToken
    } = {};
    for (let i = 0; i < kvs.length; ++i) {
        const member = kvs[i].memberName;
        if (valuesSoFar[member.repr]) {
            return fail(ErrorDuplicatedMember(member, valuesSoFar[member.repr]));
        }
        valuesSoFar[member.repr] = member;
    }
    return ok(true);
}

export function findMemberType(key: AtomicToken, structDecl: StructDeclaration)
: Maybe<TypeExpression, ErrorDetail> {
    const members = structDecl.members;
    const matchingMember = members.filter((x) => x.name.repr === key.repr);
    if (matchingMember.length > 0) {
        return ok(matchingMember[0].expectedType);
    } else {
        return fail(ErrorAccessingInexistentMember(structDecl, key));
    }
}

export function fillUpKeyValueListTypeInfo(kvs: KeyValue[], symbols: SymbolTable, vartab: VariableTable)
: Maybe<[KeyValue[], SymbolTable], ErrorDetail> {
    for (let i = 0; i < kvs.length; i++) {
        const result = fillUpExpressionTypeInfo(kvs[i].expression, symbols, vartab);
        if (isOK(result)) {
            [kvs[i].expression, symbols] = result.value;
        } else {
            return result;
        }
    }
    return ok([kvs, symbols] as [KeyValue[], SymbolTable]);
}

export function fillUpVariableTypeInfo(e: Variable, vartab: VariableTable)
: Maybe<Variable, ErrorDetail> {
    const matching = findVariable(e, vartab, false);
    if (isOK(matching)) {  e.returnType = matching.value.returnType; } else { return matching; }
    return ok(e);
}

export type SimpleExpression = NumberExpression | StringExpression;

export function fillUpSimpleTypeInfo(e: SimpleExpression, name: BuiltinTypename): SimpleExpression {
    return {
        ...e,
        returnType: newBuiltinType(name)
    };
}

export function fillUpFunctionCallTypeInfo(e: FunctionCall, symbols: SymbolTable, vartab: VariableTable):
Maybe<[FunctionCall, FunctionTable], ErrorDetail> {
    e.callingFile = CURRENT_SOURCE_CODE().filename;
    for (let i = 0; i < e.parameters.length; i++) {
        const result = fillUpExpressionTypeInfo(e.parameters[i], symbols, vartab);
        if (result.kind === "OK") { [e.parameters[i], symbols] = result.value; } else { return result; }
    }
    return getMatchingFunction(e, symbols.funcTab, symbols.typeTree);
}

export function getMatchingFunction(f: FunctionCall, functab: FunctionTable, typetree: Tree < TypeExpression >)
: Maybe<[FunctionCall, FunctionTable], ErrorDetail> {
    const key = getFunctionSignature(f);
    if (key in functab) {
        const matchingFunctions = functab[key].filter((x) => x.parameters.length === f.parameters.length);
        const result = getClosestFunction(f, matchingFunctions, typetree);
        if (result.kind === "Fail") { 
            return result; 
        } else {
            const closestFunction = result.value;
            // This step is necessary to fix parent type E.g., changing (Number -> Number)
            // to (Any -> Number)
            for (let j = 0; j < f.parameters.length; j++) {
                f.parameters[j].returnType = closestFunction.parameters[j].typeExpected;
            }
    
            f.returnType = closestFunction.returnType;
    
            if (closestFunction.isAsync) {
                f.isAsync = true;
            }
            return ok([f, functab] as [FunctionCall, FunctionTable]);
        }
    } else {
        return fail(ErrorUsingUnknownFunction(f));
    }
}

export function getClosestFunction(
    f: FunctionCall,
    matchingFunctions: FunctionDeclaration[],
    typeTree: Tree < TypeExpression >
): Maybe<FunctionDeclaration, ErrorDetail> {
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
            return ok(matchingFunc);
        }
    }

    // If can't find exactly matching function, find the closest function
    let closestFunction: FunctionDeclaration & {originalFunction?: FunctionDeclaration} | null = null;
    let minimumDistance = Number.MAX_VALUE;
    const errors: Array < {
        paramPosition: number
    } > = [];
    const relatedFuncs: FunctionDeclaration[] = [];
    for (let i = 0; i < matchingFunctions.length; i++) {
        const currentFunc : FunctionDeclaration & {originalFunction?: FunctionDeclaration} 
            = copy(matchingFunctions[i]);
        const matchingParams = f.parameters;
        if (containsGeneric(currentFunc.parameters)) {
            
            // this line is needed, because we dont need to transpile substituted generic function
            currentFunc.originalFunction = matchingFunctions[i];
            const genericsBinding = extractGenericBinding(currentFunc.parameters, f.parameters);
            if (genericsBinding !== null) {
                for (let j = 0; j < currentFunc.parameters.length; j++) {
                    currentFunc.parameters[j].typeExpected =
                        substituteGeneric(currentFunc.parameters[j].typeExpected, genericsBinding);
                }
                currentFunc.returnType = substituteGeneric(currentFunc.returnType, genericsBinding);
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
        const farthestMatchingParamPosition = errors.sort((x, y) => x.paramPosition - y.paramPosition)[0].paramPosition;
        return fail(ErrorNoConformingFunction(
            f, farthestMatchingParamPosition,
            f.parameters[farthestMatchingParamPosition],
            relatedFuncs.map((x) => x.parameters[farthestMatchingParamPosition].typeExpected)
        ));
    } else {
        if(closestFunction.originalFunction !== undefined) { // means that the closestFunction is a generic function
            const result = closestFunction.originalFunction;
            result.returnType = closestFunction.returnType; // this line is needed to pass FCBIO-007
            return ok(result)
        } else {
            return ok(closestFunction);
        }
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
            const generics = genericType.genericList;
            if (actualType.kind === "UnresolvedType") {
                throw new Error(`${actualType} is not resolved yet`);
            }
            if (actualType.kind === "StructType" || actualType.kind === "BuiltinType") {
                for (let j = 0; j < generics.length; j++) {
                    result = {
                        ...result,
                        ...extract(generics[j], actualType.genericList[j])
                    };
                }
            }
            break;
        default: /*no substituion required*/
            break;
    }
    return result;
}

export function paramTypesConforms(
    expectedParams: VariableDeclaration[],
    actualParams: Expression[],
    typeTree: Tree < TypeExpression >
): [ number, { paramPosition: number/*zero-based*/ } | null ] {
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

function substituteGeneric(
    unsubstitutedType: TypeExpression,
    genericBinding: TableOf < TypeExpression >
): TypeExpression {
    switch (unsubstitutedType.kind) {
        case "GenericTypename":
            return genericBinding[unsubstitutedType.name.repr];
        case "BuiltinType":
        case "StructType":
            const generics = unsubstitutedType.genericList;
            for (let i = 0; i < generics.length; i++) {
                generics[i] = substituteGeneric(generics[i], genericBinding);
            }
            unsubstitutedType.genericList = generics;
    }
    return unsubstitutedType;
}

export function fillUpArrayTypeInfo(e: ListExpression, symbols: SymbolTable, vartab: VariableTable)
: Maybe<[ListExpression, SymbolTable], ErrorDetail> {
    if (e.elements !== null) {
        const result = fillUpElementsType(e.elements, symbols, vartab);
        if (isOK(result)) { [e.elements, symbols] = result.value; } else { return result; }

        const elementType = getElementsType(e.elements);
        if (isOK(elementType)) { e.returnType = elementType.value; } else { return elementType; }
    } else {
        throw new Error("impossible");
    }
    return ok([e, symbols] as [ListExpression, SymbolTable]);
}

export function fillUpElementsType(exprs: Expression[], symbols: SymbolTable, vartab: VariableTable)
: Maybe<[Expression[], SymbolTable], ErrorDetail> {
    for (let i = 0; i < exprs.length; i++) {
        const result = fillUpExpressionTypeInfo(exprs[i], symbols, vartab);
        if (isOK(result)) { [exprs[i], symbols] = result.value; } else { return result; }
    }
    return ok([exprs, symbols] as [Expression[], SymbolTable]);
}

export function getElementsType(elements: Expression[])
: Maybe<BuiltinType, ErrorDetail> {
    const result = checkIfAllElementTypeAreHomogeneous(elements);
    if (result.kind === "Fail") {
        return result;
    } else {
        const types = elements.map((x) => x.returnType);
        return ok(newListType(types[0]) as BuiltinType);
    }
}

export function checkIfAllElementTypeAreHomogeneous(ex: Expression[])
: Maybe<null, ErrorDetail> {
    const typeOfFirstElement = ex[0].returnType;
    for (let i = 0; i < ex.length; i++) {
        if (!typeEquals(ex[i].returnType, typeOfFirstElement)) {
            return fail(ErrorListElementsArentHomogeneous(ex[i], i, typeOfFirstElement));
        }
    }
    return ok(null);
}

export function genericsEqual(genericsOfX: GenericList, genericsOfY: GenericList): boolean {
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
export function resolveGenericsType(genericList: GenericList, symbols: SymbolTable)
: Maybe<GenericList, ErrorDetail> {
    if (genericList === null) {
        return genericList;
    }
    for (let i = 0; i < genericList.length; i++) {
        const result = resolveType(genericList[i], symbols);
        if (result.kind === "OK") {
            genericList[i] = result.value;
        } else {
            return result;
        }
    }
    return ok(genericList);
}

export function typeEquals(x: TypeExpression, y: TypeExpression | null): boolean {
    if (y === null) {
        return false;
    }
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
            case "GroupDeclaration":
                return x.name.repr === (y as GroupDeclaration).name.repr;
            default:
                throw new Error(`Type comparison for ${x.kind} is not implemented yet`);
        }
    }
}

function isNil(t: TypeExpression): boolean {
    return t.kind === "EnumDeclaration" && t.name.repr === "Nil";
}

export type SourceCodeExtractor = (x: TokenLocation) => string;
