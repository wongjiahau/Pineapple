import { SyntaxTree } from "./ast";
import { ErrorDetail } from "./errorType/ErrorDetail";
import { fillUpTypeInformation, SymbolTable } from "./fillUpTypeInformation";
import { InterpreterOptions } from "./interpret";
import { Maybe, ok } from "./maybeMonad";
import { initTypeTree } from "./typeTree";

export function getIntermediateRepresentation(
    ast: SyntaxTree,
    prevIntermediate: IntermediateRepresentation,
    options: InterpreterOptions
): Maybe<IntermediateRepresentation, ErrorDetail> {
    const result = fillUpTypeInformation(
        ast,
        prevIntermediate.symbolTable,
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
            thingTab: {},
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
