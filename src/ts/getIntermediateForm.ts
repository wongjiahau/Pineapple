import { Declaration, LinkedNode } from "./ast";
import { SourceCode } from "./cli";
import { ErrorSyntax } from "./errorType/E0010-Syntax";
import { ErrorLexical } from "./errorType/E0028-Lexical";
import { fillUpTypeInformation, raise, SymbolTable } from "./fillUpTypeInformation";
import { initTypeTree } from "./typeTree";
import { parseCodeToSyntaxTree } from "./parseCodeToSyntaxTree";

export function getIntermediateForm(
    sourceCode: SourceCode,
    prevIntermediate: IntermediateForm,
): IntermediateForm {
    try {
        const ast = parseCodeToSyntaxTree(sourceCode);
        // prettyPrint(ast, true);
        const [newAst, symbolTable] = fillUpTypeInformation(
            ast,
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
            // this part is needed to inject the sourceCode
            raise(ErrorSyntax(error.hash), sourceCode);
        } else if (isLexError(error)) {
            raise(ErrorLexical(error), sourceCode);
        }
        throw error; // Will be caught by interpreter.ts
    }
}

export function isSyntaxError(error: any) {
    return error.hash !== undefined && error.hash.token !== null;
}

export function isLexError(error: any) {
    return error.hash !== undefined && error.hash.token === null;
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

export function convertToLinkedNode<T>(array: T[]): LinkedNode<T> | null {
    if (array.length === 0) {
        return null;
    } else {
        const result: LinkedNode<T> = {
            current: array[0],
            next: null
        };
        let now: LinkedNode<T> | null = result;
        for (let i = 1; i < array.length; i++) {
            if (now !== null) {
                now.next = {
                    current: array[i],
                    next: null
                };
                now = now.next;
            } else {
                throw new Error("Impossible, if the flow reach here, this algo have bug");
            }
        }
        return result;
    }
}
