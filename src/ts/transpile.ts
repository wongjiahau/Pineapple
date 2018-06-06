import { Declaration, FunctionCall, FunctionDeclaration, Statement } from "./ast";

export function transpileDeclaration(input: Declaration): string {
    if (input.kind === "FunctionDeclaration") {
        return transpileFunctionDeclaration(input);
    }

}

export function transpileFunctionDeclaration(f: FunctionDeclaration): string {
    return "" +
`
function ${f.signature} (${f.parameters.map((x) => x.name).join(",").slice(0, -1)}) {
    ${transpileStatement(f.statements)}
}

${transpileDeclaration(f.next)}
`;
}

export function transpileStatement(s: Statement): string {
    if (s.kind === "FunctionCall") {
        return transpileFunctionCall(s);
    }
}

export function transpileFunctionCall(f: FunctionCall): string {

}
