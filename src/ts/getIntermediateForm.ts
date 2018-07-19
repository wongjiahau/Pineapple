import { Declaration } from "./ast";
import { PineError } from "./errorType";
import { fillUpTypeInformation } from "./fillUpTypeInformation";
import { generateErrorMessage } from "./generateErrorMessage";
import { SourceCode } from "./pineRepl";
import { preprocess } from "./preprocess";
import { initTypeTree } from "./typeTree";
const parser     = require("../jison/pineapple-parser-v2");

export function getIntermediateForm(
    sourceCode: SourceCode,
    prevIntermediate: IntermediateForm,
): IntermediateForm {
    try {
        const ast = parser.parse(preprocess(sourceCode.content));
        const [newAst, newFuncTab, newTypeTree] = fillUpTypeInformation(
            ast,
            prevIntermediate.funcTab,
            prevIntermediate.typeTree,
        );
        prevIntermediate.funcTab = newFuncTab;
        prevIntermediate.typeTree = newTypeTree;
        prevIntermediate.syntaxTrees.push(newAst);
        return prevIntermediate;
    } catch (error) {
        const x = (error as PineError);
        x.errorMessage = generateErrorMessage(sourceCode.content, x.rawError, sourceCode.filename);
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