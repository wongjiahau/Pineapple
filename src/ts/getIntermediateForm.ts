import { Declaration, LinkedNode } from "./ast";
import { PineError } from "./errorType";
import { CompileError } from "./errorType/ErrorNoStructRedeclare";
import { fillUpTypeInformation, FunctionTable, StructTable } from "./fillUpTypeInformation";
import { generateErrorMessage } from "./generateErrorMessage";
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
    } catch (e) {
        const error = (e as CompileError);
        // error.setSourceCode(sourceCode);
        // const error = (e as PineError);
        // if (error.rawError) {
        //     error.errorMessage =
        //         generateErrorMessage(
        //             sourceCode.content,
        //             error.rawError,
        //             sourceCode.filename
        //         );
        // }
        throw error;
    }
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
