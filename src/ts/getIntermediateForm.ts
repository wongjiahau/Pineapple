import { Declaration, LinkedNode } from "./ast";
import { PineError } from "./errorType";
import { fillUpTypeInformation, FunctionTable } from "./fillUpTypeInformation";
import { generateErrorMessage } from "./generateErrorMessage";
import { prettyPrint } from "./pine2js";
import { SourceCode } from "./pineRepl";
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
        const [newAst, newFuncTab, newTypeTree] = fillUpTypeInformation(
            flattenLinkedNode(ast),
            prevIntermediate.funcTab,
            prevIntermediate.typeTree,
        );
        prevIntermediate.funcTab = newFuncTab;
        prevIntermediate.typeTree = newTypeTree;
        prevIntermediate.syntaxTrees = prevIntermediate.syntaxTrees.concat(newAst);
        return prevIntermediate;
    } catch (e) {
        console.log(e);
        const error = (e as PineError);
        error.errorMessage =
            generateErrorMessage(
                sourceCode.content,
                error.rawError,
                sourceCode.filename
            );
        throw error;
    }
}

export function initialIntermediateForm(): IntermediateForm {
    return {
        syntaxTrees: [],
        funcTab: {},
        typeTree: initTypeTree()
    };
}

export interface IntermediateForm {
    syntaxTrees: Declaration[];
    funcTab: FunctionTable;
    typeTree: TypeTree;
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
