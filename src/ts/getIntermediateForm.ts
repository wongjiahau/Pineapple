import { Declaration, SyntaxTree } from "./ast";
import { ErrorDetail } from "./errorType/errorUtil";
import { fillUpTypeInformation, Maybe, ok, SymbolTable } from "./fillUpTypeInformation";
import { initTypeTree } from "./typeTree";

export function getIntermediateForm(
    ast: SyntaxTree,
    prevIntermediate: IntermediateForm,
): Maybe<IntermediateForm, ErrorDetail> {
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

export function initialIntermediateForm(): IntermediateForm {
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

export interface IntermediateForm {
    syntaxTrees: Declaration[];
    symbolTable: SymbolTable;
    importedFiles: string[];
}
