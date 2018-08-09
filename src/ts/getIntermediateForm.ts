import { Declaration, LinkedNode } from "./ast";
import { ErrorSyntax } from "./errorType/E0010-Syntax";
import { fillUpTypeInformation, FunctionTable, raise, StructTable, SymbolTable } from "./fillUpTypeInformation";
import { SourceCode } from "./interpreter";
import { prettyPrint } from "./pine2js";
import { preprocess } from "./preprocess";
import { initTypeTree, TypeTree } from "./typeTree";
const parser     = require("../jison/pineapple-parser-v2");

export function getIntermediateForm(
    sourceCode: SourceCode,
    prevIntermediate: IntermediateForm,
): IntermediateForm {
    try {
        const ast = parser.parse(preprocess(sourceCode.content)) as LinkedNode<Declaration>;
        // prettyPrint(ast, true);
        const [newAst, symbolTable] = fillUpTypeInformation(
            flattenLinkedNode(ast),
            sourceCode,
            prevIntermediate.symbolTable
        );
        return {
            syntaxTrees: prevIntermediate.syntaxTrees.concat(newAst),
            importedFiles: prevIntermediate.importedFiles.concat([sourceCode.filename]),
            symbolTable: symbolTable
        };
    } catch (error) {
        if (isSyntaxError(error)) {
            raise(ErrorSyntax(error.hash), sourceCode);
        }
        throw error; // Will be caught by interpreter.ts
    }
}

function isSyntaxError(error: any) {
    return error.hash !== undefined;
}

export function initialIntermediateForm(): IntermediateForm {
    return {
        syntaxTrees: [],
        symbolTable: {
            funcTab: {},
            structTab: {},
            enumTab: {},
            typeTree: initTypeTree(),
        },
        importedFiles: []
    };
}

export interface IntermediateForm {
    syntaxTrees: Declaration[];
    symbolTable: SymbolTable;
    importedFiles: string[];
}

export function flattenLinkedNode<T>(ast: LinkedNode<T> | null): T[] {
    if (ast === null) {
        return [];
    }
    const result: T[] = [];
    let next: LinkedNode<T> | null = ast;
    while (next) {
        result.push(next.current);
        next = next.next;
    }
    return result;
}
