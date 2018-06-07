import {
    Declaration,
    Expression,
    FunctionCall,
    FunctionDeclaration,
    JavascriptCode,
    LinkStatement,
    Statement,
    StringExpression,
    Variable
} from "./ast";

// Note: tp means transpile
// Example: tpDeclaration means transpileDeclaration

export function tpDeclaration(input: Declaration): string {
    if (!input) {
        return "";
    }
    if (input.body.kind === "FunctionDeclaration") {
        return tpFunctionDeclaration(input.body);
    }
}

export function tpFunctionDeclaration(f: FunctionDeclaration): string {
    return "" +
`
function ${f.signature.token.value}(${tpParameters(f.parameters)}) {
${tpStatement(f.statements)};
}
${tpDeclaration(f.next)}
`;
}

export function tpStatement(s: Statement): string {
    const next = s.next　? ";\n" + tpStatement(s.next) : "";
    switch (s.body.kind) {
        case "FunctionCall": return tpFunctionCall(s.body) + next;
        case "LinkStatement": return tpLinkStatement(s.body) + next;
        case "JavascriptCode": return tpJavascriptCode(s.body) + next;
    }
}

export function tpFunctionCall(f: FunctionCall): string {
    return `${f.fix}_${f.signature.token.value}` +
    `(${removeLastComma(f.parameters.map((x) => tpExpression(x)).join(","))})`;
}

export function tpLinkStatement(l: LinkStatement): string {
    return `${l.isDeclaration ? "let" : ""} ${l.variable.name.token.value} = ${tpExpression(l.expression)}`;
}

export function tpParameters(v: Variable[]): string {
    return removeLastComma(v.map((x) => x.name.token.value).join(","));
}

export function tpExpression(e: Expression): string {
    switch (e.kind) {
        case "FunctionCall": return tpFunctionCall(e);
        case "String": return tpStringExpression(e);
        case "Variable": return e.name.token.value;
    }
}

export function tpJavascriptCode(s: JavascriptCode): string {
    return "" +
`// <javascript>
${s.value.token.value}
// </javascript>
`;
}

export function tpStringExpression(s: StringExpression): string {
    return `"${s.value.token.value.slice(1, -1)}"`;
}

export function removeLastComma(s: string): string {
    return s[s.length - 1] === ","
        ? s.slice(0, -1)
        : s
    ;
}
