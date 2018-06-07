import {
    Declaration,
    Expression,
    FunctionCall,
    FunctionDeclaration,
    JavascriptCode,
    LinkStatement,
    Statement,
    StringExpression,
    TypeExpression,
    Variable
} from "./ast";

// Note: tp means transpile
// Example: tpDeclaration means transpileDeclaration

export function tpDeclaration(input: Declaration): string {
    if (!input) {
        return "";
    }
    const next = input.next ? tpDeclaration(input.next) : "";
    if (input.body.kind === "FunctionDeclaration") {
        return tpFunctionDeclaration(input.body) + next;
    }
}

export function tpFunctionDeclaration(f: FunctionDeclaration): string {
    return "" +
`
function ${f.fix}_${f.signature.token.value}_${getParamsType(f.parameters)}(${tpParameters(f.parameters)}) {
${tpStatement(f.statements)};
}
`;
}

function getParamsType(p: Variable[]): string {
    if (p.length === 0) {
        return "";
    }
    return p.map((x) => stringifyTypeExpression(x.type)).join("_");
}

function stringifyTypeExpression(t: TypeExpression): string {
    return t.name.token.value + (t.isList ? "List" : "");
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
