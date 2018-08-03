import { Declaration, LinkedNode } from "./ast";
import { ErrorSyntax } from "./errorType/ErrorSyntax";
import { fillUpTypeInformation, FunctionTable, raise, StructTable } from "./fillUpTypeInformation";
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
        const [newAst, newFuncTab, newTypeTree, newStructTab] = fillUpTypeInformation(
            flattenLinkedNode(ast),
            prevIntermediate.funcTab,
            prevIntermediate.typeTree,
            prevIntermediate.structTab,
            sourceCode
        );
        return {
            funcTab: newFuncTab,
            typeTree: newTypeTree,
            structTab: newStructTab,
            syntaxTrees: prevIntermediate.syntaxTrees.concat(newAst),
            importedFiles: prevIntermediate.importedFiles.concat([sourceCode.filename])
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
        funcTab: {},
        structTab: {},
        typeTree: initTypeTree(),
        importedFiles: []
    };
}

export interface IntermediateForm {
    syntaxTrees: Declaration[];
    funcTab: FunctionTable;
    structTab: StructTable;
    typeTree: TypeTree;
    importedFiles: string[];
}

export function flattenLinkedNode<T>(ast: LinkedNode<T>): T[] {
    const result: T[] = [];
    let next: LinkedNode<T> | null = ast;
    while (next) {
        result.push(next.current);
        next = next.next;
    }
    return result;
}
