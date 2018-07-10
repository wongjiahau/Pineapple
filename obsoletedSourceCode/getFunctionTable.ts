import { Declaration, FunctionAffix, TypeExpression } from "./ast";

export interface FunctionTable {
    [signature: string]: FunctionTableEntry;
}

export interface FunctionTableEntry {
    returnType: TypeExpression;
    argumentTypes: TypeExpression[];
    affix: FunctionAffix;
    signature: string;
}

export function getFunctionTable(d: Declaration): FunctionTable {
    const result: FunctionTable = {};
    let next = d;
    do {
        if (next.body.kind === "FunctionDeclaration") {
            result[next.body.signature.token.value] = {
                affix         : next.body.affix,
                argumentTypes : next.body.parameters.map((x) => x.type),
                returnType    : next.body.returnType,
                signature     : next.body.signature.token.value
            };
        }
        next = next.next;
    } while (next);
    return result;
}
