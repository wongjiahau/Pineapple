import { Declaration, SyntaxTree } from "./ast";
import { fillUpTypeInformation, SymbolTable } from "./fillUpTypeInformation";
import { initTypeTree } from "./typeTree";

export function getIntermediateForm(
    ast: SyntaxTree,
    prevIntermediate: IntermediateForm,
): IntermediateForm {
    const [newAst, symbolTable] = fillUpTypeInformation(
        ast,
        prevIntermediate.symbolTable
    );
    return {
        syntaxTrees: prevIntermediate.syntaxTrees.concat(newAst),
        importedFiles: prevIntermediate.importedFiles.concat([ast.source.filename]),
        symbolTable: symbolTable
    };
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
