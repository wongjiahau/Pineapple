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
    if (f.parameters.length === 0) {
        return "" +
        `
function ${f.signature}(${tpParameters(f.parameters)}){
${tpStatement(f.statements)};
}
`;
    } else if (f.parameters.length === 1) {
        return `${f.parameters[0].typeExpected.name}.prototype.` +
`${f.signature}=function(){
let ${f.parameters[0].name} = this;
${tpStatement(f.statements)}}
`;
    }
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
    if (f.parameters.length === 0) {
        return `${f.signature}();`;
    }
    if (f.parameters.length === 1) {
        return `${tpExpression(f.parameters[0])}.${f.signature}()`;
    }
}

// export function getExpressionType(e: Expression): string {
//     switch (e.kind) {
//         case "FunctionCall": return break;
//         case "String": return "String";
//         case "Variable": return;
//     }
//     throw new Error("unimplemented yet");
// }

export function tpLinkStatement(l: LinkStatement): string {
    return `${l.isDeclaration ? "const" : ""} ${l.variable.name} = ${tpExpression(l.expression)}`;
}

export function tpParameters(v: Variable[]): string {
    return removeLastComma(v.map((x) => x.name.token.value).join(","));
}

export function tpExpression(e: Expression): string {
    switch (e.kind) {
        case "FunctionCall": return tpFunctionCall(e);
        case "String": return tpStringExpression(e);
        case "Variable": return e.name;
    }
}

export function tpJavascriptCode(s: JavascriptCode): string {
    return "" +
`// <javascript>
${s.value.replace(/(<javascript>|<\/javascript>|@.+)/g, "").trim()}
// </javascript>
`;
}
export function tpStringExpression(s: StringExpression): string {
    return `"${s.value.slice(1, -1)}"`;
}

export function removeLastComma(s: string): string {
    return s[s.length - 1] === "," ? s.slice(0, -1) : s ;
}
