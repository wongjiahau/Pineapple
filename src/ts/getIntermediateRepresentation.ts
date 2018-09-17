import { SyntaxTree } from "./ast";
import { ErrorDetail } from "./errorType/ErrorDetail";
import { fillUpTypeInformation, SymbolTable } from "./fillUpTypeInformation";
import { initTypeTree } from "./typeTree";
import { Maybe, ok } from "./maybeMonad";

export function getIntermediateRepresentation(
    ast: SyntaxTree,
    prevIntermediate: IntermediateRepresentation,
): Maybe<IntermediateRepresentation, ErrorDetail> {
    const result = fillUpTypeInformation(
        ast,
        prevIntermediate.symbolTable
    );
    if (result.kind === "OK") {
        const [newAst, symbolTable] = result.value;
        return ok({
            syntaxTrees: prevIntermediate.syntaxTrees.concat(newAst),
            importedFiles: prevIntermediate.importedFiles.concat([ast.source.filename]),
            symbolTable: symbolTable,
        });
    } else {
        return result;
    }
}

export function initialIntermediateForm(): IntermediateRepresentation {
    return {
        syntaxTrees: [],
        symbolTable: {
            funcTab: {},
            structTab: {},
            enumTab: {},
            typeTree: initTypeTree(),
        },
        importedFiles: [],
    };
}

export interface IntermediateRepresentation {
    syntaxTrees: SyntaxTree[];
    symbolTable: SymbolTable;
    importedFiles: string[];
}
